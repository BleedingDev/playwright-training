FROM composer:2.10.2 AS php-dependencies

WORKDIR /app
COPY composer.json composer.lock ./
RUN composer install \
    --no-dev \
    --no-interaction \
    --no-progress \
    --no-scripts \
    --prefer-dist \
    --optimize-autoloader

FROM composer:2.10.2 AS php-test-dependencies

WORKDIR /app
COPY composer.json composer.lock ./
RUN composer install \
    --no-interaction \
    --no-progress \
    --no-scripts \
    --prefer-dist \
    --ignore-platform-req=ext-sockets

FROM node:26.5.0-trixie-slim AS node-runtime
RUN npm install --global pnpm@11.13.0

FROM php:8.5.8-cli-trixie AS frontend

ARG VITE_ENABLE_MSW=true
ENV VITE_ENABLE_MSW=$VITE_ENABLE_MSW

WORKDIR /app
COPY --from=node-runtime /usr/local /usr/local
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./
RUN pnpm install --frozen-lockfile
COPY . .
COPY --from=php-dependencies /app/vendor ./vendor
RUN php artisan wayfinder:generate --with-form -vvv
RUN pnpm run build

FROM php:8.5.8-cli-trixie AS application

RUN apt-get update \
    && apt-get install --yes --no-install-recommends curl \
    && rm -rf /var/lib/apt/lists/*

WORKDIR /app
COPY . .
COPY --from=php-dependencies /app/vendor ./vendor
COPY --from=frontend /app/public/build ./public/build

RUN mkdir -p /data storage/framework/cache storage/framework/sessions storage/framework/views storage/logs \
    && chown -R www-data:www-data /data storage bootstrap/cache

USER www-data
EXPOSE 8080

CMD ["sh", "-c", "touch /data/database.sqlite && exec php artisan serve --host=0.0.0.0 --port=8080"]

FROM application AS testing

USER root
RUN echo "memory_limit=512M" > "$PHP_INI_DIR/conf.d/99-testing.ini"
RUN apt-get update \
    && apt-get install --yes --no-install-recommends libicu-dev \
    && docker-php-ext-install intl sockets \
    && rm -rf /var/lib/apt/lists/* \
    && cp .env.example .env \
    && mkdir -p /tmp/pest-mutate-cache \
    && chown www-data:www-data /tmp/pest-mutate-cache
COPY --from=php-test-dependencies /app/vendor ./vendor
RUN mkdir -p \
        vendor/pestphp/pest/.temp \
        vendor/pestphp/pest-plugin-browser/.temp \
        vendor/pestphp/pest-plugin-mutate/.temp/pest-mutate-cache \
        vendor/pestphp/pest-plugin-type-coverage/.temp \
    && chown -R www-data:www-data \
        vendor/pestphp/pest/.temp \
        vendor/pestphp/pest-plugin-browser/.temp \
        vendor/pestphp/pest-plugin-mutate/.temp \
        vendor/pestphp/pest-plugin-type-coverage/.temp
USER www-data

CMD ["php", "artisan", "test"]
