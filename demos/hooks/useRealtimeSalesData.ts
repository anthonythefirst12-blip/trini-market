"use client";

import { useState, useEffect, useRef } from "react";

export interface SaleDataPoint {
  time: string;
  sales: number;
}

export interface LatestPayment {
  id: string;
  amount: number;
  product: string;
  customer: string;
  time: string;
}

const PRODUCTS = [
  "Toyota Hilux 2020",
  "iPhone 14 Pro",
  "Apartment - Port of Spain",
  "Samsung 65\" TV",
  "Honda CRV 2019",
  "Gaming PC Setup",
  "Beats Studio Buds",
  "PlayStation 5",
  "MacBook Pro M2",
  "Air Jordan 4",
  "Fridge - LG 18 cu ft",
  "Kawasaki Ninja 400",
];

const CUSTOMERS = [
  "Marcus P.",
  "Alicia R.",
  "Devon W.",
  "Kezia M.",
  "Tristan B.",
  "Anika S.",
  "Cyril J.",
  "Tamara L.",
  "Rondell F.",
  "Simone A.",
];

function formatTime(date: Date): string {
  return date.toLocaleTimeString("en-US", { hour12: false });
}

function randomAmount(): number {
  return Math.random() * 4500 + 50;
}

export function useRealtimeSalesData() {
  const [salesChartData, setSalesChartData] = useState<SaleDataPoint[]>([]);
  const [cumulativeRevenueData, setCumulativeRevenueData] = useState<SaleDataPoint[]>([]);
  const [totalRevenue, setTotalRevenue] = useState(0);
  const [salesCount, setSalesCount] = useState(0);
  const [averageSale, setAverageSale] = useState(0);
  const [latestPayments, setLatestPayments] = useState<LatestPayment[]>([]);

  const cumulativeRef = useRef(0);
  const countRef = useRef(0);

  useEffect(() => {
    const interval = setInterval(() => {
      const now = new Date();
      const timeStr = formatTime(now);

      const salesToAdd = Math.floor(Math.random() * 4);
      let secondTotal = 0;

      const newPayments: LatestPayment[] = [];
      for (let i = 0; i < salesToAdd; i++) {
        const amount = randomAmount();
        secondTotal += amount;
        newPayments.push({
          id: `${Date.now()}-${i}`,
          amount,
          product: PRODUCTS[Math.floor(Math.random() * PRODUCTS.length)],
          customer: CUSTOMERS[Math.floor(Math.random() * CUSTOMERS.length)],
          time: timeStr,
        });
      }

      cumulativeRef.current += secondTotal;
      countRef.current += salesToAdd;

      const newCumulative = cumulativeRef.current;
      const newCount = countRef.current;

      setSalesChartData((prev) => {
        const next = [...prev, { time: timeStr, sales: secondTotal }];
        return next.slice(-60);
      });

      setCumulativeRevenueData((prev) => {
        const next = [...prev, { time: timeStr, sales: newCumulative }];
        return next.slice(-60);
      });

      setTotalRevenue(newCumulative);
      setSalesCount(newCount);
      setAverageSale(newCount > 0 ? newCumulative / newCount : 0);

      if (newPayments.length > 0) {
        setLatestPayments((prev) => {
          return [...newPayments, ...prev].slice(0, 10);
        });
      }
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  return {
    totalRevenue,
    cumulativeRevenueData,
    salesCount,
    averageSale,
    salesChartData,
    latestPayments,
  };
}
