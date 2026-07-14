import * as React from "react";
import type {
  DefaultLegendContentProps,
  DefaultTooltipContentProps,
  TooltipContentProps,
  TooltipProps,
} from "recharts";
import * as RechartsPrimitive from "recharts";

import { cn } from "@/lib/utils";

// Format: { THEME_NAME: CSS_SELECTOR }
const THEMES = { dark: ".dark", light: "" } as const;

type ValueType = number | string | readonly (number | string)[];
type NameType = number | string;

type RechartsTooltipProps = TooltipProps<ValueType, NameType>;
type TooltipPayload = NonNullable<
  DefaultTooltipContentProps<ValueType, NameType>["payload"]
>;
type TooltipPayloadItem = TooltipPayload[number];
type TooltipFormatter = RechartsTooltipProps["formatter"];
type ChartTooltipContentProps = Omit<
  TooltipContentProps<ValueType, NameType>,
  "payload"
> & { payload?: TooltipPayload };

export type ChartConfig = Record<
  string,
  {
    label?: React.ReactNode;
    icon?: React.ComponentType;
  } & (
    | { color?: string; theme?: never }
    | { color?: never; theme: Record<keyof typeof THEMES, string> }
  )
>;

type ChartItemConfig = ChartConfig[string];

interface ChartContextProps {
  config: ChartConfig;
}

const ChartContext = React.createContext<ChartContextProps | null>(null);

const buildChartStyles = (id: string, config: ChartConfig) => {
  const colorConfig = Object.entries(config).filter(
    ([, itemConfig]) => itemConfig.theme || itemConfig.color
  );

  if (!colorConfig.length) {
    return null;
  }

  return Object.entries(THEMES)
    .map(
      ([theme, prefix]) => `
${prefix} [data-chart=${id}] {
${colorConfig
  .map(([key, itemConfig]) => {
    const color =
      itemConfig.theme?.[theme as keyof typeof itemConfig.theme] ||
      itemConfig.color;
    return color ? `  --color-${key}: ${color};` : null;
  })
  .join("\n")}
}
`
    )
    .join("\n");
};

function useChart() {
  const context = React.useContext(ChartContext);

  if (!context) {
    throw new Error("useChart must be used within a <ChartContainer />");
  }

  return context;
}

function ChartContainer({
  id,
  className,
  children,
  config,
  ...props
}: React.ComponentProps<"div"> & {
  config: ChartConfig;
  children: React.ComponentProps<
    typeof RechartsPrimitive.ResponsiveContainer
  >["children"];
}) {
  const uniqueId = React.useId();
  const chartId = `chart-${id || uniqueId.replaceAll(":", "")}`;

  return (
    <ChartContext.Provider value={{ config }}>
      <div
        data-slot="chart"
        data-chart={chartId}
        className={cn(
          "[&_.recharts-cartesian-axis-tick_text]:fill-muted-foreground [&_.recharts-cartesian-grid_line[stroke='#ccc']]:stroke-border/50 [&_.recharts-curve.recharts-tooltip-cursor]:stroke-border [&_.recharts-polar-grid_[stroke='#ccc']]:stroke-border [&_.recharts-radial-bar-background-sector]:fill-muted [&_.recharts-rectangle.recharts-tooltip-cursor]:fill-muted [&_.recharts-reference-line_[stroke='#ccc']]:stroke-border flex aspect-video justify-center text-xs [&_.recharts-dot[stroke='#fff']]:stroke-transparent [&_.recharts-layer]:outline-hidden [&_.recharts-sector]:outline-hidden [&_.recharts-sector[stroke='#fff']]:stroke-transparent [&_.recharts-surface]:outline-hidden",
          className
        )}
        {...props}
      >
        <ChartStyle id={chartId} config={config} />
        <RechartsPrimitive.ResponsiveContainer>
          {children}
        </RechartsPrimitive.ResponsiveContainer>
      </div>
    </ChartContext.Provider>
  );
}

const ChartStyle = ({ id, config }: { id: string; config: ChartConfig }) => {
  const styles = buildChartStyles(id, config);

  if (!styles) {
    return null;
  }

  return <style>{styles}</style>;
};

const ChartTooltip = RechartsPrimitive.Tooltip;

const getTooltipLabelValue = ({
  config,
  label,
  labelKey,
  payload,
}: {
  config: ChartConfig;
  label: ChartTooltipContentProps["label"];
  labelKey?: string;
  payload: TooltipPayload;
}) => {
  const [item] = payload;
  const key = `${labelKey || item?.dataKey || item?.name || "value"}`;
  const itemConfig = getPayloadConfigFromPayload(config, item, key);

  if (!labelKey && typeof label === "string") {
    return config[label as keyof typeof config]?.label || label;
  }

  return itemConfig?.label;
};

const renderTooltipLabel = ({
  value,
  labelFormatter,
  labelClassName,
  payload,
}: {
  value?: React.ReactNode;
  labelFormatter: RechartsTooltipProps["labelFormatter"];
  labelClassName?: string;
  payload: TooltipPayload;
}) => {
  if (labelFormatter) {
    return (
      <div className={cn("font-medium", labelClassName)}>
        {labelFormatter(value, payload)}
      </div>
    );
  }

  if (!value) {
    return null;
  }

  return <div className={cn("font-medium", labelClassName)}>{value}</div>;
};

const resolveTooltipLabel = ({
  config,
  hideLabel,
  payload,
  label,
  labelFormatter,
  labelClassName,
  labelKey,
}: {
  config: ChartConfig;
  hideLabel: boolean;
  payload: TooltipPayload | undefined;
  label: ChartTooltipContentProps["label"];
  labelFormatter: RechartsTooltipProps["labelFormatter"];
  labelClassName?: string;
  labelKey?: string;
}) => {
  if (hideLabel || !payload?.length) {
    return null;
  }

  const value = getTooltipLabelValue({
    config,
    label,
    labelKey,
    payload,
  });

  return renderTooltipLabel({
    labelClassName,
    labelFormatter,
    payload,
    value,
  });
};

function ChartTooltipContent({
  active,
  payload,
  className,
  indicator = "dot",
  hideLabel = false,
  hideIndicator = false,
  label,
  labelFormatter,
  labelClassName,
  formatter,
  color,
  nameKey,
  labelKey,
}: ChartTooltipContentProps &
  React.ComponentProps<"div"> & {
    hideLabel?: boolean;
    hideIndicator?: boolean;
    indicator?: "line" | "dot" | "dashed";
    nameKey?: string;
    labelKey?: string;
  }) {
  const { config } = useChart();

  const tooltipLabel = resolveTooltipLabel({
    config,
    hideLabel,
    payload,
    label,
    labelFormatter,
    labelClassName,
    labelKey,
  });

  if (active && payload?.length) {
    const shouldNestLabel = payload.length === 1 && indicator !== "dot";
    const shouldShowLabel = payload.length !== 1 || indicator === "dot";
    const showIndicator = hideIndicator !== true;

    return (
      <div
        className={cn(
          "border-border/50 bg-background gap-1.5 rounded-lg border px-2.5 py-1.5 text-xs/relaxed shadow-xl grid min-w-[8rem] items-start",
          className
        )}
      >
        {shouldShowLabel && tooltipLabel}
        <div className="grid gap-1.5">
          {payload
            .filter((item) => item.type !== "none")
            .map((item, index) => {
              const itemKey =
                typeof item.dataKey === "string" ||
                typeof item.dataKey === "number"
                  ? item.dataKey
                  : (item.name ?? index);

              return (
                <ChartTooltipItem
                  key={itemKey}
                  item={item}
                  index={index}
                  config={config}
                  indicator={indicator}
                  showIndicator={showIndicator}
                  nestLabel={shouldNestLabel}
                  tooltipLabel={tooltipLabel}
                  formatter={formatter}
                  color={color}
                  nameKey={nameKey}
                />
              );
            })}
        </div>
      </div>
    );
  }

  return null;
}

function ChartTooltipItem({
  item,
  index,
  config,
  indicator,
  showIndicator,
  nestLabel,
  tooltipLabel,
  formatter,
  color,
  nameKey,
}: {
  item: TooltipPayloadItem;
  index: number;
  config: ChartConfig;
  indicator: "line" | "dot" | "dashed";
  showIndicator: boolean;
  nestLabel: boolean;
  tooltipLabel: React.ReactNode;
  formatter?: TooltipFormatter;
  color?: string;
  nameKey?: string;
}) {
  const key = `${nameKey || item.name || item.dataKey || "value"}`;
  const itemConfig = getPayloadConfigFromPayload(config, item, key);
  const indicatorColor = getIndicatorColor(item, color);

  if (formatter && item?.value !== undefined && item.name) {
    return (
      <div
        className={cn(
          "[&>svg]:text-muted-foreground flex w-full flex-wrap items-stretch gap-2 [&>svg]:h-2.5 [&>svg]:w-2.5",
          indicator === "dot" && "items-center"
        )}
      >
        {formatter(item.value, item.name, item, index, item.payload)}
      </div>
    );
  }

  return (
    <div
      className={cn(
        "[&>svg]:text-muted-foreground flex w-full flex-wrap items-stretch gap-2 [&>svg]:h-2.5 [&>svg]:w-2.5",
        indicator === "dot" && "items-center"
      )}
    >
      {itemConfig?.icon ? (
        <itemConfig.icon />
      ) : (
        showIndicator && (
          <ChartTooltipIndicator
            indicator={indicator}
            indicatorColor={indicatorColor}
            nestLabel={nestLabel}
          />
        )
      )}
      <ChartTooltipItemContent
        item={item}
        itemConfig={itemConfig}
        nestLabel={nestLabel}
        tooltipLabel={tooltipLabel}
      />
    </div>
  );
}

function ChartTooltipIndicator({
  indicator,
  indicatorColor,
  nestLabel,
}: {
  indicator: "line" | "dot" | "dashed";
  indicatorColor?: string;
  nestLabel: boolean;
}) {
  return (
    <div
      className={cn(
        "shrink-0 rounded-[2px] border-(--color-border) bg-(--color-bg)",
        {
          "h-2.5 w-2.5": indicator === "dot",
          "my-0.5": nestLabel && indicator === "dashed",
          "w-0 border-[1.5px] border-dashed bg-transparent":
            indicator === "dashed",
          "w-1": indicator === "line",
        }
      )}
      style={
        {
          "--color-bg": indicatorColor,
          "--color-border": indicatorColor,
        } as React.CSSProperties
      }
    />
  );
}

function ChartTooltipItemContent({
  item,
  itemConfig,
  nestLabel,
  tooltipLabel,
}: {
  item: TooltipPayloadItem;
  itemConfig?: ChartItemConfig;
  nestLabel: boolean;
  tooltipLabel: React.ReactNode;
}) {
  return (
    <div
      className={cn(
        "flex flex-1 justify-between leading-none",
        nestLabel ? "items-end" : "items-center"
      )}
    >
      <div className="grid gap-1.5">
        {nestLabel && tooltipLabel}
        <span className="text-muted-foreground">
          {itemConfig?.label || item.name}
        </span>
      </div>
      {item.value !== undefined && item.value !== null ? (
        <span className="text-foreground font-mono font-medium tabular-nums">
          {item.value.toLocaleString()}
        </span>
      ) : null}
    </div>
  );
}

function getIndicatorColor(item: TooltipPayloadItem, color?: string) {
  const payloadFill =
    typeof item.payload === "object" && item.payload !== null
      ? (item.payload as { fill?: string }).fill
      : undefined;

  return color || payloadFill || item.color;
}

const ChartLegend = RechartsPrimitive.Legend;

function ChartLegendContent({
  className,
  hideIcon = false,
  payload,
  verticalAlign = "bottom",
  nameKey,
}: React.ComponentProps<"div"> &
  Pick<DefaultLegendContentProps, "payload" | "verticalAlign"> & {
    hideIcon?: boolean;
    nameKey?: string;
  }) {
  const { config } = useChart();

  if (!payload?.length) {
    return null;
  }

  return (
    <div
      className={cn(
        "flex items-center justify-center gap-4",
        verticalAlign === "top" ? "pb-3" : "pt-3",
        className
      )}
    >
      {payload
        .filter((item) => item.type !== "none")
        .map((item) => {
          const key = `${nameKey || item.dataKey || "value"}`;
          const itemConfig = getPayloadConfigFromPayload(config, item, key);

          return (
            <div
              key={item.value}
              className={cn(
                "[&>svg]:text-muted-foreground flex items-center gap-1.5 [&>svg]:h-3 [&>svg]:w-3"
              )}
            >
              {itemConfig?.icon && !hideIcon ? (
                <itemConfig.icon />
              ) : (
                <div
                  className="h-2 w-2 shrink-0 rounded-[2px]"
                  style={{
                    backgroundColor: item.color,
                  }}
                />
              )}
              {itemConfig?.label}
            </div>
          );
        })}
    </div>
  );
}

function getPayloadConfigFromPayload(
  config: ChartConfig,
  payload: unknown,
  key: string
) {
  if (typeof payload !== "object" || payload === null) {
    return;
  }

  const payloadPayload =
    "payload" in payload &&
    typeof payload.payload === "object" &&
    payload.payload !== null
      ? payload.payload
      : undefined;

  let configLabelKey: string = key;

  if (
    key in payload &&
    typeof payload[key as keyof typeof payload] === "string"
  ) {
    configLabelKey = payload[key as keyof typeof payload] as string;
  } else if (
    payloadPayload &&
    key in payloadPayload &&
    typeof payloadPayload[key as keyof typeof payloadPayload] === "string"
  ) {
    configLabelKey = payloadPayload[
      key as keyof typeof payloadPayload
    ] as string;
  }

  return configLabelKey in config
    ? config[configLabelKey]
    : config[key as keyof typeof config];
}

export {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  ChartLegend,
  ChartLegendContent,
  ChartStyle,
};
