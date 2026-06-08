import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ChevronLeft } from 'lucide-react';
import Link from 'next/link';

export function StudentRegistrationPage() {
    return (
        <div className="p-6 space-y-6 max-w-5xl mx-auto">
            <div className="flex items-center gap-4">
                <Link href="/student">
                    <Button variant="outline" size="icon" className="h-8 w-8">
                        <ChevronLeft className="h-4 w-4" />
                    </Button>
                </Link>
                <div>
                    <h1 className="text-2xl font-bold text-gray-800">Student Registration</h1>
                    <p className="text-sm text-gray-500">Register a new student into the system.</p>
                </div>
            </div>
            
            <Card className="shadow-sm border-none ring-1 ring-gray-200">
                <CardHeader className="bg-gray-50/50 rounded-t-xl">
                    <CardTitle className="text-lg">Personal Information</CardTitle>
                    <CardDescription>Enter the basic details of the student.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4 pt-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        <div className="space-y-2">
                            <Label htmlFor="firstName">First Name</Label>
                            <Input id="firstName" placeholder="e.g. John" className="bg-white" />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="lastName">Last Name</Label>
                            <Input id="lastName" placeholder="e.g. Doe" className="bg-white" />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="dob">Date of Birth</Label>
                            <Input id="dob" type="date" className="bg-white" />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="gender">Gender</Label>
                            <Select>
                                <SelectTrigger className="bg-white">
                                    <SelectValue placeholder="Select gender" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="male">Male</SelectItem>
                                    <SelectItem value="female">Female</SelectItem>
                                    <SelectItem value="other">Other</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="bloodGroup">Blood Group</Label>
                            <Select>
                                <SelectTrigger className="bg-white">
                                    <SelectValue placeholder="Select blood group" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="A+">A+</SelectItem>
                                    <SelectItem value="A-">A-</SelectItem>
                                    <SelectItem value="B+">B+</SelectItem>
                                    <SelectItem value="O+">O+</SelectItem>
                                    <SelectItem value="O-">O-</SelectItem>
                                    <SelectItem value="AB+">AB+</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="religion">Religion</Label>
                            <Input id="religion" placeholder="e.g. Islam" className="bg-white" />
                        </div>
                    </div>
                </CardContent>
            </Card>

            <Card className="shadow-sm border-none ring-1 ring-gray-200">
                <CardHeader className="bg-gray-50/50 rounded-t-xl">
                    <CardTitle className="text-lg">Academic Information</CardTitle>
                    <CardDescription>Select the class and section for enrollment.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4 pt-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        <div className="space-y-2">
                            <Label htmlFor="class">Class</Label>
                            <Select>
                                <SelectTrigger className="bg-white">
                                    <SelectValue placeholder="Select class" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="class1">Class 1</SelectItem>
                                    <SelectItem value="class2">Class 2</SelectItem>
                                    <SelectItem value="class3">Class 3</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="section">Section</Label>
                            <Select>
                                <SelectTrigger className="bg-white">
                                    <SelectValue placeholder="Select section" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="a">A</SelectItem>
                                    <SelectItem value="b">B</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="roll">Roll Number</Label>
                            <Input id="roll" placeholder="e.g. 01" className="bg-white" />
                        </div>
                    </div>
                </CardContent>
            </Card>

            <div className="flex justify-end gap-4 pb-12">
                <Link href="/student">
                    <Button variant="outline">Cancel</Button>
                </Link>
                <Button className="bg-blue-600 hover:bg-blue-700 text-white shadow-sm">Save Registration</Button>
            </div>
        </div>
    );
}
