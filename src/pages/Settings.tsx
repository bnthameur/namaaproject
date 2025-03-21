
import React from 'react';
import { Form } from '@/components/ui/form';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import {
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormDescription,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import BlurCard from '@/components/ui/BlurCard';
import { Separator } from '@/components/ui/separator';
import { toast } from 'sonner';

const schoolFormSchema = z.object({
  name: z.string().min(2, 'School name is required'),
  address: z.string().min(5, 'School address is required'),
  phone: z.string().min(5, 'Phone number is required'),
  email: z.string().email('Invalid email address'),
  website: z.string().url('Invalid website URL'),
  principal: z.string().min(2, 'Principal name is required'),
  description: z.string().optional(),
});

const notificationFormSchema = z.object({
  emailNotifications: z.boolean().default(true),
  smsNotifications: z.boolean().default(false),
  paymentReminders: z.boolean().default(true),
  attendanceAlerts: z.boolean().default(true),
  systemUpdates: z.boolean().default(true),
  marketingEmails: z.boolean().default(false),
});

const Settings: React.FC = () => {
  const schoolForm = useForm<z.infer<typeof schoolFormSchema>>({
    resolver: zodResolver(schoolFormSchema),
    defaultValues: {
      name: 'City International School',
      address: '123 Education Lane, Academic City, CA 90210',
      phone: '(555) 123-4567',
      email: 'info@cityschool.edu',
      website: 'https://www.cityschool.edu',
      principal: 'Dr. Robert Johnson',
      description: 'A leading international school providing quality education since 1995.',
    },
  });

  const notificationForm = useForm<z.infer<typeof notificationFormSchema>>({
    resolver: zodResolver(notificationFormSchema),
    defaultValues: {
      emailNotifications: true,
      smsNotifications: false,
      paymentReminders: true,
      attendanceAlerts: true,
      systemUpdates: true,
      marketingEmails: false,
    },
  });

  const onSchoolSubmit = (data: z.infer<typeof schoolFormSchema>) => {
    toast.success('School settings saved successfully');
    console.log(data);
  };

  const onNotificationSubmit = (data: z.infer<typeof notificationFormSchema>) => {
    toast.success('Notification settings saved successfully');
    console.log(data);
  };

  return (
    <div className="py-8 px-4 sm:px-6 lg:px-8 animate-fade-in">
      <h1 className="text-3xl font-bold mb-6">Settings</h1>
      
      <Tabs defaultValue="school" className="space-y-6">
        <TabsList className="grid grid-cols-3 w-full max-w-md">
          <TabsTrigger value="school">School</TabsTrigger>
          <TabsTrigger value="notifications">Notifications</TabsTrigger>
          <TabsTrigger value="system">System</TabsTrigger>
        </TabsList>
        
        <TabsContent value="school">
          <BlurCard>
            <h2 className="text-xl font-semibold mb-4">School Information</h2>
            <p className="text-muted-foreground mb-6">
              Update your school details and information.
            </p>
            
            <Form {...schoolForm}>
              <form onSubmit={schoolForm.handleSubmit(onSchoolSubmit)} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <FormField
                    control={schoolForm.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>School Name</FormLabel>
                        <FormControl>
                          <Input placeholder="Enter school name" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={schoolForm.control}
                    name="principal"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Principal</FormLabel>
                        <FormControl>
                          <Input placeholder="Enter principal name" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                
                <FormField
                  control={schoolForm.control}
                  name="address"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Address</FormLabel>
                      <FormControl>
                        <Textarea 
                          placeholder="Enter school address" 
                          {...field} 
                          className="resize-none"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <FormField
                    control={schoolForm.control}
                    name="phone"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Phone</FormLabel>
                        <FormControl>
                          <Input placeholder="Enter phone number" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={schoolForm.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Email</FormLabel>
                        <FormControl>
                          <Input placeholder="Enter email address" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={schoolForm.control}
                    name="website"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Website</FormLabel>
                        <FormControl>
                          <Input placeholder="Enter website URL" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                
                <FormField
                  control={schoolForm.control}
                  name="description"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Description</FormLabel>
                      <FormControl>
                        <Textarea 
                          placeholder="Enter school description" 
                          {...field} 
                          className="resize-none min-h-[100px]"
                        />
                      </FormControl>
                      <FormDescription>
                        Briefly describe your school and its mission.
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <div className="flex justify-end">
                  <Button type="submit">Save Changes</Button>
                </div>
              </form>
            </Form>
          </BlurCard>
        </TabsContent>
        
        <TabsContent value="notifications">
          <BlurCard>
            <h2 className="text-xl font-semibold mb-4">Notification Preferences</h2>
            <p className="text-muted-foreground mb-6">
              Manage how you receive notifications and alerts.
            </p>
            
            <Form {...notificationForm}>
              <form onSubmit={notificationForm.handleSubmit(onNotificationSubmit)} className="space-y-6">
                <div className="space-y-4">
                  <FormField
                    control={notificationForm.control}
                    name="emailNotifications"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                        <div className="space-y-0.5">
                          <FormLabel className="text-base">Email Notifications</FormLabel>
                          <FormDescription>
                            Receive notifications via email
                          </FormDescription>
                        </div>
                        <FormControl>
                          <Switch
                            checked={field.value}
                            onCheckedChange={field.onChange}
                          />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={notificationForm.control}
                    name="smsNotifications"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                        <div className="space-y-0.5">
                          <FormLabel className="text-base">SMS Notifications</FormLabel>
                          <FormDescription>
                            Receive notifications via text messages
                          </FormDescription>
                        </div>
                        <FormControl>
                          <Switch
                            checked={field.value}
                            onCheckedChange={field.onChange}
                          />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                  
                  <Separator />
                  
                  <div className="my-4">
                    <h3 className="text-lg font-medium">Notification Types</h3>
                    <p className="text-sm text-muted-foreground">Select which types of notifications you want to receive</p>
                  </div>
                  
                  <FormField
                    control={notificationForm.control}
                    name="paymentReminders"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                        <div className="space-y-0.5">
                          <FormLabel className="text-base">Payment Reminders</FormLabel>
                          <FormDescription>
                            Notifications about upcoming and overdue payments
                          </FormDescription>
                        </div>
                        <FormControl>
                          <Switch
                            checked={field.value}
                            onCheckedChange={field.onChange}
                          />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={notificationForm.control}
                    name="attendanceAlerts"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                        <div className="space-y-0.5">
                          <FormLabel className="text-base">Attendance Alerts</FormLabel>
                          <FormDescription>
                            Notifications about student attendance issues
                          </FormDescription>
                        </div>
                        <FormControl>
                          <Switch
                            checked={field.value}
                            onCheckedChange={field.onChange}
                          />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={notificationForm.control}
                    name="systemUpdates"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                        <div className="space-y-0.5">
                          <FormLabel className="text-base">System Updates</FormLabel>
                          <FormDescription>
                            Notifications about new features and system maintenance
                          </FormDescription>
                        </div>
                        <FormControl>
                          <Switch
                            checked={field.value}
                            onCheckedChange={field.onChange}
                          />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={notificationForm.control}
                    name="marketingEmails"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                        <div className="space-y-0.5">
                          <FormLabel className="text-base">Marketing Emails</FormLabel>
                          <FormDescription>
                            Receive news, promotions and updates from us
                          </FormDescription>
                        </div>
                        <FormControl>
                          <Switch
                            checked={field.value}
                            onCheckedChange={field.onChange}
                          />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                </div>
                
                <div className="flex justify-end">
                  <Button type="submit">Save Preferences</Button>
                </div>
              </form>
            </Form>
          </BlurCard>
        </TabsContent>
        
        <TabsContent value="system">
          <BlurCard>
            <h2 className="text-xl font-semibold mb-4">System Settings</h2>
            <p className="text-muted-foreground mb-6">
              Manage system settings and preferences.
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-4">
                <h3 className="text-lg font-medium">Academic Year</h3>
                <div className="rounded-lg border p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-medium">Current Academic Year</h4>
                      <p className="text-sm text-muted-foreground">2023-2024</p>
                    </div>
                    <Button variant="outline">Change</Button>
                  </div>
                </div>
                
                <h3 className="text-lg font-medium mt-4">Data Management</h3>
                <div className="rounded-lg border p-4">
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="font-medium">Export Data</h4>
                        <p className="text-sm text-muted-foreground">Download all school data</p>
                      </div>
                      <Button variant="outline">Export</Button>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="font-medium">Import Data</h4>
                        <p className="text-sm text-muted-foreground">Upload data from CSV files</p>
                      </div>
                      <Button variant="outline">Import</Button>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="font-medium">Backup System</h4>
                        <p className="text-sm text-muted-foreground">Create a backup of all data</p>
                      </div>
                      <Button variant="outline">Backup</Button>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="space-y-4">
                <h3 className="text-lg font-medium">System Information</h3>
                <div className="rounded-lg border p-4 space-y-3">
                  <div>
                    <h4 className="text-sm font-medium text-muted-foreground">Version</h4>
                    <p>SchoolFlow Manager v1.0</p>
                  </div>
                  
                  <div>
                    <h4 className="text-sm font-medium text-muted-foreground">Last Updated</h4>
                    <p>September 30, 2023</p>
                  </div>
                  
                  <div>
                    <h4 className="text-sm font-medium text-muted-foreground">Storage Used</h4>
                    <div className="w-full h-2 bg-gray-200 rounded-full mt-1">
                      <div className="h-full w-[35%] bg-primary rounded-full"></div>
                    </div>
                    <p className="text-sm mt-1">35% of 10GB used</p>
                  </div>
                </div>
                
                <h3 className="text-lg font-medium mt-4">Support</h3>
                <div className="rounded-lg border p-4 space-y-3">
                  <div>
                    <h4 className="font-medium">Need help?</h4>
                    <p className="text-sm text-muted-foreground">Contact our support team for assistance</p>
                  </div>
                  
                  <div className="flex flex-col gap-2">
                    <Button variant="outline">View Documentation</Button>
                    <Button>Contact Support</Button>
                  </div>
                </div>
              </div>
            </div>
          </BlurCard>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Settings;
