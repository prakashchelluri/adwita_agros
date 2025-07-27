import { ReactNode } from 'react';
interface StatCardProps {
    title: string;
    value: string | number;
    icon: ReactNode;
}
export default function StatCard({ title, value, icon }: StatCardProps): any;
export {};
