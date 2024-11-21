"use client";

import { TrendingUp } from "lucide-react";
import { Bar, BarChart, CartesianGrid, XAxis, YAxis} from "recharts";

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
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";

const chartConfig = {
  desktop: {
    label: "Ventas",
    color: "hsl(var(--chart-1))",
  },
} satisfies ChartConfig;

export function VentasPorMes() {
  const { ventas, fetchVentas } = useProductos() as ContextType;
  const [selectedYear, setSelectedYear] = useState<string>("");

  useEffect(() => {
    fetchVentas();
  }, [fetchVentas]);

  // Obtener años únicos de las ventas y seleccionar el más reciente
  const years = useMemo(() => {
    const uniqueYears = Array.from(
      new Set(ventas.map((venta) => venta.fecha.split("/")[2]))
    ).sort((a, b) => Number(b) - Number(a)); // Ordenar de más reciente a más antiguo
    if (uniqueYears.length > 0 && !selectedYear) {
      setSelectedYear(uniqueYears[0]); // Por defecto, año más reciente
    }
    return uniqueYears;
  }, [ventas, selectedYear]);

  // Filtrar ventas por el año seleccionado
  const filteredVentas = useMemo(
    () => ventas.filter((venta) => venta.fecha.split("/")[2] === selectedYear),
    [ventas, selectedYear]
  );

  // Agrupar las ventas filtradas por mes
  const chartData = useMemo(() => {
    const months = [
      "Enero",
      "Febrero",
      "Marzo",
      "Abril",
      "Mayo",
      "Junio",
      "Julio",
      "Agosto",
      "Septiembre",
      "Octubre",
      "Noviembre",
      "Diciembre",
    ];

    const grouped = filteredVentas.reduce((acc, venta) => {
      const [, month, year] = venta.fecha.split("/").map(Number);
      const key = `${months[month - 1]} ${year}`;
      acc[key] = (acc[key] || 0) + (venta.cantidad ?? 0);
      return acc;
    }, {} as Record<string, number>);

    return Object.entries(grouped).map(([month, total]) => ({
      month,
      desktop: total,
    }));
  }, [filteredVentas]);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Ventas por Mes</CardTitle>
        <CardDescription>Evolución de ventas mensuales</CardDescription>
      </CardHeader>
      <CardContent>
        <Accordion type="single" collapsible>
          <AccordionItem value="year">
            <AccordionTrigger>Seleccionar Año</AccordionTrigger>
            <AccordionContent>
              <ul className="space-y-2">
                {years.map((year) => (
                  <li key={year}>
                    <button
                      onClick={() => setSelectedYear(year)}
                      className={`px-4 py-2 w-full text-left rounded-md ${
                        selectedYear === year
                          ? "bg-blue-500 text-white"
                          : "hover:bg-gray-100"
                      }`}
                    >
                      {year}
                    </button>
                  </li>
                ))}
              </ul>
            </AccordionContent>
          </AccordionItem>
        </Accordion>
        <ChartContainer config={chartConfig}>
          <BarChart
            accessibilityLayer
            data={chartData}
            layout="vertical"
            margin={{ left: -20 }}
          >
            <CartesianGrid vertical={false} />
            <XAxis
              type="number"
              dataKey="desktop"
              hide
            />
            <YAxis
              dataKey="month"
              type="category"
              tickLine={false}
              tickMargin={10}
              axisLine={false}
              tickFormatter={(value) => value.slice(0, 3)} // Mostrar solo las primeras 3 letras del mes
            />
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent hideLabel />}
            />
            <Bar dataKey="desktop" fill="var(--color-desktop)" radius={5} />
          </BarChart>
        </ChartContainer>
      </CardContent>
      <CardFooter className="flex-col items-start gap-2 text-sm">
        <div className="flex gap-2 font-medium leading-none">
          Trending up by 5.2% this month <TrendingUp className="h-4 w-4" />
        </div>
        <div className="leading-none text-muted-foreground">
          Mostrando ventas totales por mes para el año {selectedYear}
        </div>
      </CardFooter>
    </Card>
  );
}
