<?php

declare(strict_types=1);

return [
    'driver' => env('RUIAN_DRIVER', 'http'),
    'endpoint' => env('RUIAN_ENDPOINT', 'https://ags.cuzk.gov.cz/arcgis/rest/services/RUIAN/Vyhledavaci_sluzba_nad_daty_RUIAN/MapServer'),
    'token' => env('RUIAN_TOKEN'),
    'timeout' => (int) env('RUIAN_TIMEOUT', 3),
];
