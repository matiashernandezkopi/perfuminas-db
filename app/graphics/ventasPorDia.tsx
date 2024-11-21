"use client";

import { TrendingUp } from "lucide-react";
import { Bar, BarChart, CartesianGrid, LabelList, XAxis, YAxis } from "recharts";

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { ContextType, useProductos } from "../context/productosContext";
import { useEffect, useMemo, useState } from "react";

const chartConfig = {
  desktop: {
    label: "Desktop",
    color: "hsl(var(--chart-1))",
  },
  label: {
    color: "hsl(var(--background))",
  },
} satisfies ChartConfig;

export function VentasPorDia() {
  const { ventas, fetchVentas } = useProductos() as ContextType;
  const [selectedMonth, setSelectedMonth] = useState<string>("");

  useEffect(() => {
    fetchVentas();
  }, [fetchVentas]);

  // Obtener meses únicos con formato MM/YYYY y seleccionar el más reciente
  const months = useMemo(() => {
    const uniqueMonths = Array.from(
      new Set(
        ventas.map((venta) => {
          const [, month, year] = venta.fecha.split("/").map(Number);
          return `${month}/${year}`;
        })
      )
    ).sort((a, b) => {
      const [monthA, yearA] = a.split("/").map(Number);
      const [monthB, yearB] = b.split("/").map(Number);
      return yearB - yearA || monthB - monthA; // Ordenar por año y luego por mes
    });
    if (uniqueMonths.length > 0 && !selectedMonth) {
      setSelectedMonth(uniqueMonths[0]); // Por defecto, el mes más reciente
    }
    return uniqueMonths;
  }, [ventas, selectedMonth]);

  // Filtrar ventas por el mes seleccionado
  const filteredVentas = useMemo(() => {
    return ventas.filter((venta) => {
      const [, month, year] = venta.fecha.split("/").map(Number);
      return `${month}/${year}` === selectedMonth;
    });
  }, [ventas, selectedMonth]);

  // Agrupar ventas por día de la semana
  const chartData = useMemo(() => {
    const daysOfWeek = ["Domingo", "Lunes", "Martes", "Miércoles", "Jueves", "Viernes", "Sábado"];
    const grouped = filteredVentas.reduce((acc, venta) => {
      const [day, month, year] = venta.fecha.split("/").map(Number);
      const date = new Date(year, month - 1, day); // Crear fecha
      const dayOfWeek = date.getDay(); // Obtener día de la semana (0=Domingo, 6=Sábado)
      acc[dayOfWeek] = (acc[dayOfWeek] || 0) + (venta.cantidad ?? 0);
      return acc;
    }, {} as Record<number, number>);

    return daysOfWeek.map((day, index) => ({
      day,
      desktop: grouped[index] || 0, // Cantidad por día de la semana
    }));
  }, [filteredVentas]);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Ventas por Día</CardTitle>
        <CardDescription>
          Ventas agrupadas por día de la semana en {selectedMonth}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="mb-4">
          <select
            className="px-4 py-2 rounded-md border"
            value={selectedMonth}
            onChange={(e) => setSelectedMonth(e.target.value)}
          >
            {months.map((month) => (
              <option key={month} value={month}>
                {month}
              </option>
            ))}
          </select>
        </div>
        <ChartContainer config={chartConfig}>
          <BarChart
            accessibilityLayer
            data={chartData}
            layout="vertical"
            margin={{
              right: 16,
            }}
          >
            <CartesianGrid horizontal={false} />
            <YAxis
              dataKey="day"
              type="category"
              tickLine={false}
              tickMargin={10}
              axisLine={false}
            />
            <XAxis dataKey="desktop" type="number" hide />
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent indicator="line" />}
            />
            <Bar
              dataKey="desktop"
              layout="vertical"
              fill="var(--color-desktop)"
              radius={4}
            >
              <LabelList
                dataKey="day"
                position="insideLeft"
                offset={8}
                className="fill-[--color-label]"
                fontSize={12}
              />
              <LabelList
                dataKey="desktop"
                position="right"
                offset={8}
                className="fill-foreground"
                fontSize={12}
              />
            </Bar>
          </BarChart>
        </ChartContainer>
      </CardContent>
      <CardFooter className="flex-col items-start gap-2 text-sm">
        <div className="flex gap-2 font-medium leading-none">
          Ventas en días seleccionados <TrendingUp className="h-4 w-4" />
        </div>
        <div className="leading-none text-muted-foreground">
          Mostrando ventas por día de la semana en {selectedMonth}
        </div>
      </CardFooter>
    </Card>
  );
}
