import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';

export function StudentPromotionPage() {
    return (
        <div className="p-6 space-y-6">
            <div>
                <h1 className="text-2xl font-bold text-gray-800">Student Promotion</h1>
                <p className="text-sm text-gray-500">Manage .</p>
            </div>
            <Card className="shadow-sm">
                <CardHeader>
                    <CardTitle>Overview</CardTitle>
                    <CardDescription>Under construction</CardDescription>
                </CardHeader>
                <CardContent>
                    <p className="text-gray-500">This module is currently being built.</p>
                </CardContent>
            </Card>
        </div>
    );
}
