'use client';

import { useState, useEffect } from 'react';
import { DashboardLayout } from '@/components/dashboard/dashboard-layout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Package, 
  Plus, 
  Search, 
  Edit, 
  Trash2, 
  Monitor,
  Smartphone,
  DollarSign
} from 'lucide-react';
import { dataStore, type Asset } from '@/lib/data-store';
import { toast } from 'sonner';
import { useSearchParams } from 'next/navigation';

export default function AssetsPage() {
  const [assets, setAssets] = useState<Asset[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [editingAsset, setEditingAsset] = useState<Asset | null>(null);
  const [activeTab, setActiveTab] = useState('all');
  const [isMounted, setIsMounted] = useState(false);
  
  const searchParams = useSearchParams();

  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    setAssets(dataStore.getAssets());
    if (isMounted && searchParams.get('add') === 'true') {
      setIsAddDialogOpen(true);
    }
  }, [searchParams, isMounted]);

  // Calculate totals
  const physicalAssets = assets.filter(a => a.category === 'physical');
  const digitalAssets = assets.filter(a => a.category === 'digital');
  const totalPhysicalValue = physicalAssets.reduce((sum, a) => sum + a.purchasePrice, 0);
  const totalDigitalValue = digitalAssets.reduce((sum, a) => sum + a.purchasePrice, 0);
  const totalValue = totalPhysicalValue + totalDigitalValue;

  // Filter assets based on search and tab
  const filteredAssets = assets.filter(asset => {
    const matchesSearch = asset.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         (asset.subCategory && asset.subCategory.toLowerCase().includes(searchTerm.toLowerCase())) ||
                         (asset.notes && asset.notes.toLowerCase().includes(searchTerm.toLowerCase()));
    
    const matchesTab = activeTab === 'all' || asset.category === activeTab;
    
    return matchesSearch && matchesTab;
  });

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    
    const assetData = {
      name: formData.get('name') as string,
      category: formData.get('category') as 'physical' | 'digital',
      subCategory: formData.get('subCategory') as string || undefined,
      purchaseDate: formData.get('purchaseDate') as string,
      purchasePrice: parseFloat(formData.get('purchasePrice') as string),
      condition: formData.get('condition') as 'excellent' | 'good' | 'fair' | 'poor',
      notes: formData.get('notes') as string || undefined,
    };

    if (editingAsset) {
      dataStore.updateAsset(editingAsset.id, assetData);
      toast.success('Asset updated successfully');
      setEditingAsset(null);
    } else {
      dataStore.addAsset(assetData);
      toast.success('Asset added successfully');
      setIsAddDialogOpen(false);
    }

    setAssets(dataStore.getAssets());
    (e.target as HTMLFormElement).reset();
  };

  const handleDelete = (id: string) => {
    if (confirm('Are you sure you want to delete this asset?')) {
      dataStore.deleteAsset(id);
      setAssets(dataStore.getAssets());
      toast.success('Asset deleted successfully');
    }
  };

  const AssetForm = ({ asset }: { asset?: Asset }) => (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="name">Asset Name</Label>
          <Input
            id="name"
            name="name"
            defaultValue={asset?.name}
            placeholder="MacBook Pro 16"
            required
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="category">Category</Label>
          <Select name="category" defaultValue={asset?.category}>
            <SelectTrigger>
              <SelectValue placeholder="Select category" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="physical">Physical Asset</SelectItem>
              <SelectItem value="digital">Digital Asset</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="subCategory">Sub-category</Label>
          <Input
            id="subCategory"
            name="subCategory"
            defaultValue={asset?.subCategory}
            placeholder="Electronics, Software, etc."
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="condition">Condition</Label>
          <Select name="condition" defaultValue={asset?.condition}>
            <SelectTrigger>
              <SelectValue placeholder="Select condition" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="excellent">Excellent</SelectItem>
              <SelectItem value="good">Good</SelectItem>
              <SelectItem value="fair">Fair</SelectItem>
              <SelectItem value="poor">Poor</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="purchasePrice">Purchase Price</Label>
          <Input
            id="purchasePrice"
            name="purchasePrice"
            type="number"
            step="0.01"
            defaultValue={asset?.purchasePrice}
            placeholder="0.00"
            required
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="purchaseDate">Purchase Date</Label>
          <Input
            id="purchaseDate"
            name="purchaseDate"
            type="date"
            defaultValue={asset?.purchaseDate}
            required
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="notes">Notes</Label>
        <Textarea
          id="notes"
          name="notes"
          defaultValue={asset?.notes}
          placeholder="Additional information, serial numbers, warranty details, etc."
          rows={3}
        />
      </div>

      <DialogFooter>
        <Button type="submit">
          {asset ? 'Update Asset' : 'Add Asset'}
        </Button>
      </DialogFooter>
    </form>
  );

  const getConditionBadge = (condition: string) => {
    const variants = {
      excellent: 'default',
      good: 'secondary',
      fair: 'outline',
      poor: 'destructive'
    } as const;
    
    return (
      <Badge variant={variants[condition as keyof typeof variants] || 'outline'}>
        {condition.charAt(0).toUpperCase() + condition.slice(1)}
      </Badge>
    );
  };

  return (
    <DashboardLayout>
      <div className="space-y-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-foreground">Assets</h1>
            <p className="mt-2 text-muted-foreground">
              Manage your physical and digital assets inventory.
            </p>
          </div>
          <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="mr-2 h-4 w-4" />
                Add Asset
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[600px]">
              <DialogHeader>
                <DialogTitle>Add New Asset</DialogTitle>
                <DialogDescription>
                  Enter the details of your new asset.
                </DialogDescription>
              </DialogHeader>
              <AssetForm />
            </DialogContent>
          </Dialog>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          <Card className="bg-gradient-to-br from-primary/10 to-primary/5 border-primary/20">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Assets</CardTitle>
              <Package className="h-4 w-4 text-primary" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-primary">{assets.length}</div>
              <p className="text-xs text-muted-foreground mt-1">
                {physicalAssets.length} physical, {digitalAssets.length} digital
              </p>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-accent/10 to-accent/5 border-accent/20">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Value</CardTitle>
              <DollarSign className="h-4 w-4 text-accent" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-accent">${totalValue.toLocaleString()}</div>
              <p className="text-xs text-muted-foreground mt-1">Combined asset value</p>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-chart-3/10 to-chart-3/5 border-chart-3/20">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Physical Assets</CardTitle>
              <Monitor className="h-4 w-4 text-chart-3" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-chart-3">${totalPhysicalValue.toLocaleString()}</div>
              <p className="text-xs text-muted-foreground mt-1">{physicalAssets.length} items</p>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-chart-4/10 to-chart-4/5 border-chart-4/20">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Digital Assets</CardTitle>
              <Smartphone className="h-4 w-4 text-chart-4" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-chart-4">${totalDigitalValue.toLocaleString()}</div>
              <p className="text-xs text-muted-foreground mt-1">{digitalAssets.length} items</p>
            </CardContent>
          </Card>
        </div>

        {/* Assets Table */}
        <Card>
          <CardHeader>
            <CardTitle>Asset Inventory</CardTitle>
            <CardDescription>
              Complete list of your business assets
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center space-x-2 mb-6">
              <div className="relative flex-1">
                <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search assets..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-8"
                />
              </div>
            </div>

            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="all">All Assets</TabsTrigger>
                <TabsTrigger value="physical">Physical</TabsTrigger>
                <TabsTrigger value="digital">Digital</TabsTrigger>
              </TabsList>
              
              <TabsContent value={activeTab} className="mt-6">
                <div className="rounded-md border">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Asset ID</TableHead>
                        <TableHead>Name</TableHead>
                        <TableHead>Category</TableHead>
                        <TableHead>Sub-category</TableHead>
                        <TableHead>Condition</TableHead>
                        <TableHead>Purchase Date</TableHead>
                        <TableHead>Value</TableHead>
                        <TableHead>Notes</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredAssets.map((asset) => (
                        <TableRow key={asset.id}>
                          <TableCell className="font-mono text-sm">
                            {asset.category.charAt(0).toUpperCase()}-{asset.id.slice(-4)}
                          </TableCell>
                          <TableCell className="font-medium">{asset.name}</TableCell>
                          <TableCell>
                            <Badge variant={asset.category === 'physical' ? 'default' : 'secondary'}>
                              {asset.category === 'physical' ? 'Physical' : 'Digital'}
                            </Badge>
                          </TableCell>
                          <TableCell>{asset.subCategory || '-'}</TableCell>
                          <TableCell>{getConditionBadge(asset.condition)}</TableCell>
                          <TableCell>{asset.purchaseDate}</TableCell>
                          <TableCell className="font-mono">
                            ${asset.purchasePrice.toLocaleString()}
                          </TableCell>
                          <TableCell className="max-w-[200px] truncate">
                            {asset.notes || '-'}
                          </TableCell>
                          <TableCell className="text-right">
                            <div className="flex items-center justify-end gap-2">
                              <Dialog>
                                <DialogTrigger asChild>
                                  <Button
                                    variant="ghost"
                                    size="icon"
                                    onClick={() => setEditingAsset(asset)}
                                  >
                                    <Edit className="h-4 w-4" />
                                  </Button>
                                </DialogTrigger>
                                <DialogContent className="sm:max-w-[600px]">
                                  <DialogHeader>
                                    <DialogTitle>Edit Asset</DialogTitle>
                                    <DialogDescription>
                                      Update the asset details.
                                    </DialogDescription>
                                  </DialogHeader>
                                  <AssetForm asset={editingAsset || undefined} />
                                </DialogContent>
                              </Dialog>
                              <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => handleDelete(asset.id)}
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}