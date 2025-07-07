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
type ClientAssetsProps = {
  initialShowAddDialog?: boolean;
};

export function ClientAssets({ initialShowAddDialog = false }: ClientAssetsProps) {
  const [assets, setAssets] = useState<Asset[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(initialShowAddDialog);
  const [editingAsset, setEditingAsset] = useState<Asset | null>(null);
  const [activeTab, setActiveTab] = useState('all');
  const [isMounted, setIsMounted] = useState(false);
  
  useEffect(() => {
    setIsMounted(true);
    setAssets(dataStore.getAssets());
  }, []);

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
      excellent: 'bg-green-100 text-green-800',
      good: 'bg-blue-100 text-blue-800',
      fair: 'bg-yellow-100 text-yellow-800',
      poor: 'bg-red-100 text-red-800',
    };
    
    return (
      <Badge className={variants[condition as keyof typeof variants]}>
        {condition.charAt(0).toUpperCase() + condition.slice(1)}
      </Badge>
    );
  };

  const getCategoryIcon = (category: string) => {
    if (category === 'physical') return <Package className="h-5 w-5 text-blue-500" />;
    if (category === 'digital') return <Monitor className="h-5 w-5 text-purple-500" />;
    return <Package className="h-5 w-5 text-gray-500" />;
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Assets</h1>
            <p className="text-muted-foreground">
              Track and manage your physical and digital assets
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
                <DialogTitle>{editingAsset ? 'Edit Asset' : 'Add New Asset'}</DialogTitle>
                <DialogDescription>
                  {editingAsset 
                    ? 'Update the details of your asset.'
                    : 'Add a new asset to your inventory.'}
                </DialogDescription>
              </DialogHeader>
              <AssetForm asset={editingAsset} />
            </DialogContent>
          </Dialog>
        </div>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Assets</CardTitle>
              <Package className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{assets.length}</div>
              <p className="text-xs text-muted-foreground">across all categories</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Value</CardTitle>
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">${totalValue.toLocaleString()}</div>
              <p className="text-xs text-muted-foreground">combined value of all assets</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Physical Assets</CardTitle>
              <Package className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{physicalAssets.length}</div>
              <p className="text-xs text-muted-foreground">${totalPhysicalValue.toLocaleString()} total value</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Digital Assets</CardTitle>
              <Monitor className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{digitalAssets.length}</div>
              <p className="text-xs text-muted-foreground">${totalDigitalValue.toLocaleString()} total value</p>
            </CardContent>
          </Card>
        </div>

        <Card>
          <div className="p-6">
            <div className="flex flex-col space-y-4 md:flex-row md:items-center md:justify-between md:space-y-0">
              <div className="relative w-full md:max-w-sm">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  placeholder="Search assets..."
                  className="pl-9"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              <Tabs 
                defaultValue="all" 
                className="w-full md:w-auto"
                onValueChange={(value) => setActiveTab(value)}
              >
                <TabsList>
                  <TabsTrigger value="all">All</TabsTrigger>
                  <TabsTrigger value="physical">Physical</TabsTrigger>
                  <TabsTrigger value="digital">Digital</TabsTrigger>
                </TabsList>
              </Tabs>
            </div>

            <div className="mt-6">
              <div className="overflow-hidden rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Name</TableHead>
                      <TableHead>Category</TableHead>
                      <TableHead>Sub-category</TableHead>
                      <TableHead>Purchase Date</TableHead>
                      <TableHead>Purchase Price</TableHead>
                      <TableHead>Condition</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredAssets.length > 0 ? (
                      filteredAssets.map((asset) => (
                        <TableRow key={asset.id}>
                          <TableCell className="font-medium">
                            <div className="flex items-center space-x-2">
                              {getCategoryIcon(asset.category)}
                              <span>{asset.name}</span>
                            </div>
                          </TableCell>
                          <TableCell>
                            <Badge variant="outline">
                              {asset.category.charAt(0).toUpperCase() + asset.category.slice(1)}
                            </Badge>
                          </TableCell>
                          <TableCell>{asset.subCategory || '-'}</TableCell>
                          <TableCell>
                            {new Date(asset.purchaseDate).toLocaleDateString()}
                          </TableCell>
                          <TableCell>${asset.purchasePrice.toLocaleString()}</TableCell>
                          <TableCell>{getConditionBadge(asset.condition)}</TableCell>
                          <TableCell className="text-right">
                            <div className="flex justify-end space-x-2">
                              <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => setEditingAsset(asset)}
                              >
                                <Edit className="h-4 w-4" />
                                <span className="sr-only">Edit</span>
                              </Button>
                              <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => handleDelete(asset.id)}
                                className="text-red-500 hover:text-red-700"
                              >
                                <Trash2 className="h-4 w-4" />
                                <span className="sr-only">Delete</span>
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))
                    ) : (
                      <TableRow>
                        <TableCell colSpan={7} className="text-center py-8 text-muted-foreground">
                          {searchTerm ? (
                            'No assets match your search criteria.'
                          ) : (
                            'No assets found. Add your first asset to get started.'
                          )}
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </div>
            </div>
          </div>
        </Card>
      </div>
    </DashboardLayout>
  );
}
