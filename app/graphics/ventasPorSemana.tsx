"use client";

import { TrendingUp } from "lucide-react";
import { Bar, BarChart, CartesianGrid, XAxis } from "recharts";

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

export function VentasPorSemana() {
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

  // Agrupar las ventas por semanas dentro del mes seleccionado
  const chartData = useMemo(() => {
    const weeks = ["Semana 1", "Semana 2", "Semana 3", "Semana 4"];
    const grouped = filteredVentas.reduce((acc, venta) => {
      const [day, , ] = venta.fecha.split("/").map(Number);
      const weekIndex = Math.floor((day - 1) / 7); // Calcular la semana (0 a 3)
      acc[weekIndex] = (acc[weekIndex] || 0) + (venta.cantidad ?? 0);
      return acc;
    }, {} as Record<number, number>);

    return weeks.map((week, index) => ({
      week,
      desktop: grouped[index] || 0, // Cantidad por semana
    }));
  }, [filteredVentas]);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Ventas por Semana</CardTitle>
        <CardDescription>
          Ventas agrupadas semanalmente para {selectedMonth}
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
          <BarChart accessibilityLayer data={chartData} width={500} height={300}>
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="month"
              tickLine={false}
              tickMargin={10}
              axisLine={false}
              tickFormatter={(value) => value.slice(0, 3)} // Mostrar solo las primeras 3 letras
            />
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent hideLabel />}
            />
            <Bar dataKey="desktop" fill="var(--color-desktop)" radius={8} />
          </BarChart>
        </ChartContainer>

      </CardContent>
      <CardFooter className="flex-col items-start gap-2 text-sm">
        <div className="flex gap-2 font-medium leading-none">
          Ventas en semanas seleccionadas <TrendingUp className="h-4 w-4" />
        </div>
        <div className="leading-none text-muted-foreground">
          Mostrando ventas por semana en {selectedMonth}
        </div>
      </CardFooter>
    </Card>
  );
}
