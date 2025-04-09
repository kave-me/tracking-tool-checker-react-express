import { useEffect, useState } from 'react';
import { useAuth } from '@/hooks/use-auth';
import { useQuery } from '@tanstack/react-query';
import { TagScan } from '@shared/schema';
import { formatDistanceToNow } from 'date-fns';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@/components/ui/tabs';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Loader2, CheckCircle, XCircle } from 'lucide-react';
import TagCheckerForm from '@/components/tagChecker/TagCheckerForm';

interface DashboardStats {
  totalScans: number;
  uniqueWebsites: number;
  tagsFound: {
    gtm: number;
    ga4: number;
    googleAds: number;
    metaPixel: number;
  };
  recentScans: TagScan[];
}

export default function Dashboard() {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('overview');
  
  useEffect(() => {
    document.title = 'Dashboard | Track to Measure';
  }, []);

  const { 
    data: stats, 
    isLoading: statsLoading, 
    error: statsError 
  } = useQuery<DashboardStats>({
    queryKey: ['/api/dashboard/stats'],
    enabled: !!user, // Only run if user is logged in
    retry: 1,
  });

  const { 
    data: scanHistory, 
    isLoading: historyLoading, 
    error: historyError 
  } = useQuery<TagScan[]>({
    queryKey: ['/api/dashboard/scans'],
    enabled: !!user && activeTab === 'history', // Only fetch when on history tab
    retry: 1,
  });

  if (statsLoading && activeTab === 'overview') {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if ((statsError && activeTab === 'overview') || (historyError && activeTab === 'history')) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="bg-red-50 border-l-4 border-red-400 p-4 rounded">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <h3 className="text-sm font-medium text-red-800">Error loading dashboard data</h3>
              <div className="mt-2 text-sm text-red-700">
                <p>Could not load your dashboard information. Please try again later.</p>
              </div>
              <div className="mt-4">
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={() => window.location.reload()}
                >
                  Refresh Page
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
          <p className="mt-2 text-gray-600">
            Welcome back, {user?.name || user?.username}
          </p>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-8">
        <TabsList className="grid w-full grid-cols-3 md:w-auto">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="history">Scan History</TabsTrigger>
          <TabsTrigger value="new-scan">New Scan</TabsTrigger>
        </TabsList>
        
        {/* Overview Tab */}
        <TabsContent value="overview" className="space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-gray-500">
                  Total Scans
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">{stats?.totalScans || 0}</div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-gray-500">
                  Unique Websites
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">{stats?.uniqueWebsites || 0}</div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-gray-500">
                  GTM Installed
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-blue-600">
                  {stats?.tagsFound.gtm || 0}
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-gray-500">
                  GA4 Installed
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-green-600">
                  {stats?.tagsFound.ga4 || 0}
                </div>
              </CardContent>
            </Card>
          </div>
          
          <Card>
            <CardHeader>
              <CardTitle>Recent Scans</CardTitle>
              <CardDescription>
                Your most recent website scans
              </CardDescription>
            </CardHeader>
            <CardContent>
              {stats?.recentScans?.length ? (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Website</TableHead>
                      <TableHead>Date</TableHead>
                      <TableHead className="text-center">GTM</TableHead>
                      <TableHead className="text-center">GA4</TableHead>
                      <TableHead className="text-center">Google Ads</TableHead>
                      <TableHead className="text-center">Meta Pixel</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {stats.recentScans.map((scan) => (
                      <TableRow key={scan.id}>
                        <TableCell className="font-medium max-w-[180px] truncate">
                          <a 
                            href={scan.url.startsWith('http') ? scan.url : `https://${scan.url}`} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="text-blue-600 hover:underline"
                          >
                            {scan.url}
                          </a>
                        </TableCell>
                        <TableCell>
                          {formatDistanceToNow(new Date(scan.timestamp), { addSuffix: true })}
                        </TableCell>
                        <TableCell className="text-center">
                          {scan.gtmFound ? 
                            <CheckCircle className="h-5 w-5 text-green-600 inline" /> : 
                            <XCircle className="h-5 w-5 text-red-600 inline" />}
                        </TableCell>
                        <TableCell className="text-center">
                          {scan.ga4Found ? 
                            <CheckCircle className="h-5 w-5 text-green-600 inline" /> : 
                            <XCircle className="h-5 w-5 text-red-600 inline" />}
                        </TableCell>
                        <TableCell className="text-center">
                          {scan.googleAdsFound ? 
                            <CheckCircle className="h-5 w-5 text-green-600 inline" /> : 
                            <XCircle className="h-5 w-5 text-red-600 inline" />}
                        </TableCell>
                        <TableCell className="text-center">
                          {scan.metaPixelFound ? 
                            <CheckCircle className="h-5 w-5 text-green-600 inline" /> : 
                            <XCircle className="h-5 w-5 text-red-600 inline" />}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              ) : (
                <div className="text-center py-6">
                  <p className="text-gray-500">No scan history yet</p>
                  <Button
                    className="mt-4"
                    onClick={() => setActiveTab('new-scan')}
                  >
                    Start scanning
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
        
        {/* History Tab */}
        <TabsContent value="history">
          <Card>
            <CardHeader>
              <CardTitle>Scan History</CardTitle>
              <CardDescription>
                All your previous website scans
              </CardDescription>
            </CardHeader>
            <CardContent>
              {historyLoading ? (
                <div className="flex justify-center py-8">
                  <Loader2 className="h-8 w-8 animate-spin text-primary" />
                </div>
              ) : scanHistory && scanHistory.length > 0 ? (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Website</TableHead>
                      <TableHead>Date</TableHead>
                      <TableHead className="text-center">GTM</TableHead>
                      <TableHead className="text-center">GA4</TableHead>
                      <TableHead className="text-center">Google Ads</TableHead>
                      <TableHead className="text-center">Meta Pixel</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {scanHistory.map((scan) => (
                      <TableRow key={scan.id}>
                        <TableCell className="font-medium max-w-[180px] truncate">
                          <a 
                            href={scan.url.startsWith('http') ? scan.url : `https://${scan.url}`} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="text-blue-600 hover:underline"
                          >
                            {scan.url}
                          </a>
                        </TableCell>
                        <TableCell>
                          {formatDistanceToNow(new Date(scan.timestamp), { addSuffix: true })}
                        </TableCell>
                        <TableCell className="text-center">
                          {scan.gtmFound ? 
                            <CheckCircle className="h-5 w-5 text-green-600 inline" /> : 
                            <XCircle className="h-5 w-5 text-red-600 inline" />}
                        </TableCell>
                        <TableCell className="text-center">
                          {scan.ga4Found ? 
                            <CheckCircle className="h-5 w-5 text-green-600 inline" /> : 
                            <XCircle className="h-5 w-5 text-red-600 inline" />}
                        </TableCell>
                        <TableCell className="text-center">
                          {scan.googleAdsFound ? 
                            <CheckCircle className="h-5 w-5 text-green-600 inline" /> : 
                            <XCircle className="h-5 w-5 text-red-600 inline" />}
                        </TableCell>
                        <TableCell className="text-center">
                          {scan.metaPixelFound ? 
                            <CheckCircle className="h-5 w-5 text-green-600 inline" /> : 
                            <XCircle className="h-5 w-5 text-red-600 inline" />}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              ) : (
                <div className="text-center py-6">
                  <p className="text-gray-500">No scan history found</p>
                  <Button
                    className="mt-4"
                    onClick={() => setActiveTab('new-scan')}
                  >
                    Start scanning
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
        
        {/* New Scan Tab */}
        <TabsContent value="new-scan">
          <Card>
            <CardHeader>
              <CardTitle>New Scan</CardTitle>
              <CardDescription>
                Check if a website has tracking tools installed
              </CardDescription>
            </CardHeader>
            <CardContent>
              <TagCheckerForm />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}