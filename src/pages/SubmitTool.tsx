import { useState } from "react";
import Header from "@/components/Header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { 
  Plus, 
  X, 
  Send, 
  CheckCircle, 
  Upload,
  Star,
  ExternalLink
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const SubmitTool = () => {
  const { toast } = useToast();
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const [formData, setFormData] = useState({
    name: "",
    website: "",
    description: "",
    shortDescription: "",
    category: "",
    subcategory: "",
    pricingType: "",
    startingPrice: "",
    currency: "USD",
    billingPeriod: "monthly",
    features: [""],
    platforms: [] as string[],
    tags: [""],
    useCases: [""],
    pros: [""],
    cons: [""],
    submitterName: "",
    submitterEmail: "",
    relationship: ""
  });

  const categories = [
    "Text & Writing",
    "Image & Design", 
    "Video & Media",
    "Development",
    "Productivity",
    "Music & Audio",
    "Analytics",
    "Marketing",
    "Customer Service",
    "Education"
  ];

  const platforms = [
    { id: "web", label: "Web" },
    { id: "mobile", label: "Mobile" },
    { id: "desktop", label: "Desktop" },
    { id: "api", label: "API" }
  ];

  const relationships = [
    "I'm the creator/developer",
    "I work for this company",
    "I'm a user recommending this tool",
    "Other"
  ];

  const updateFormData = (key: string, value: any) => {
    setFormData(prev => ({ ...prev, [key]: value }));
  };

  const addArrayItem = (key: string) => {
    setFormData(prev => ({
      ...prev,
      [key]: [...prev[key as keyof typeof prev] as string[], ""]
    }));
  };

  const updateArrayItem = (key: string, index: number, value: string) => {
    setFormData(prev => ({
      ...prev,
      [key]: (prev[key as keyof typeof prev] as string[]).map((item, i) => i === index ? value : item)
    }));
  };

  const removeArrayItem = (key: string, index: number) => {
    setFormData(prev => ({
      ...prev,
      [key]: (prev[key as keyof typeof prev] as string[]).filter((_, i) => i !== index)
    }));
  };

  const togglePlatform = (platform: string) => {
    setFormData(prev => ({
      ...prev,
      platforms: prev.platforms.includes(platform)
        ? prev.platforms.filter(p => p !== platform)
        : [...prev.platforms, platform]
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Simulate API call
    setTimeout(() => {
      setIsSubmitted(true);
      setIsSubmitting(false);
      toast({
        title: "Tool Submitted Successfully!",
        description: "Thank you for your submission. We'll review it and add it to our database soon.",
      });
    }, 2000);
  };

  if (isSubmitted) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="container mx-auto px-4 py-16">
          <div className="max-w-2xl mx-auto text-center">
            <div className="w-20 h-20 bg-green-500/10 rounded-full flex items-center justify-center mx-auto mb-6">
              <CheckCircle className="w-10 h-10 text-green-500" />
            </div>
            <h1 className="text-3xl font-bold mb-4">Thank You!</h1>
            <p className="text-lg text-muted-foreground mb-8">
              Your AI tool submission has been received. Our team will review it and add it to our database within 2-3 business days.
            </p>
            <div className="flex gap-4 justify-center">
              <Button onClick={() => window.location.href = '/tools'}>
                Browse Tools
              </Button>
              <Button variant="outline" onClick={() => setIsSubmitted(false)}>
                Submit Another Tool
              </Button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <div className="mb-8">
            <h1 className="text-3xl font-bold bg-gradient-primary bg-clip-text text-transparent mb-2">
              Submit an AI Tool
            </h1>
            <p className="text-muted-foreground">
              Help us grow our database by submitting new AI tools. All submissions are reviewed before being added.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-8">
            {/* Basic Information */}
            <Card>
              <CardHeader>
                <CardTitle>Basic Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="name">Tool Name *</Label>
                    <Input
                      id="name"
                      required
                      value={formData.name}
                      onChange={(e) => updateFormData('name', e.target.value)}
                      placeholder="e.g., ChatGPT"
                    />
                  </div>
                  <div>
                    <Label htmlFor="website">Website URL *</Label>
                    <Input
                      id="website"
                      type="url"
                      required
                      value={formData.website}
                      onChange={(e) => updateFormData('website', e.target.value)}
                      placeholder="https://example.com"
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="shortDescription">Short Description *</Label>
                  <Input
                    id="shortDescription"
                    required
                    value={formData.shortDescription}
                    onChange={(e) => updateFormData('shortDescription', e.target.value)}
                    placeholder="Brief one-line description"
                    maxLength={120}
                  />
                  <p className="text-xs text-muted-foreground mt-1">
                    {formData.shortDescription.length}/120 characters
                  </p>
                </div>

                <div>
                  <Label htmlFor="description">Detailed Description *</Label>
                  <Textarea
                    id="description"
                    required
                    value={formData.description}
                    onChange={(e) => updateFormData('description', e.target.value)}
                    placeholder="Provide a detailed description of what this tool does and its main capabilities"
                    rows={4}
                  />
                </div>
              </CardContent>
            </Card>

            {/* Category & Pricing */}
            <Card>
              <CardHeader>
                <CardTitle>Category & Pricing</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="category">Category *</Label>
                    <Select value={formData.category} onValueChange={(value) => updateFormData('category', value)}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select category" />
                      </SelectTrigger>
                      <SelectContent>
                        {categories.map(category => (
                          <SelectItem key={category} value={category}>{category}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="subcategory">Subcategory</Label>
                    <Input
                      id="subcategory"
                      value={formData.subcategory}
                      onChange={(e) => updateFormData('subcategory', e.target.value)}
                      placeholder="e.g., Conversational AI"
                    />
                  </div>
                </div>

                <div className="grid md:grid-cols-4 gap-4">
                  <div>
                    <Label htmlFor="pricingType">Pricing Type *</Label>
                    <Select value={formData.pricingType} onValueChange={(value) => updateFormData('pricingType', value)}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select pricing" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="free">Free</SelectItem>
                        <SelectItem value="freemium">Freemium</SelectItem>
                        <SelectItem value="paid">Paid</SelectItem>
                        <SelectItem value="enterprise">Enterprise</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  {(formData.pricingType === 'paid' || formData.pricingType === 'freemium') && (
                    <>
                      <div>
                        <Label htmlFor="startingPrice">Starting Price</Label>
                        <Input
                          id="startingPrice"
                          type="number"
                          value={formData.startingPrice}
                          onChange={(e) => updateFormData('startingPrice', e.target.value)}
                          placeholder="10"
                        />
                      </div>
                      <div>
                        <Label htmlFor="currency">Currency</Label>
                        <Select value={formData.currency} onValueChange={(value) => updateFormData('currency', value)}>
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="USD">USD</SelectItem>
                            <SelectItem value="EUR">EUR</SelectItem>
                            <SelectItem value="GBP">GBP</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div>
                        <Label htmlFor="billingPeriod">Billing</Label>
                        <Select value={formData.billingPeriod} onValueChange={(value) => updateFormData('billingPeriod', value)}>
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="monthly">Monthly</SelectItem>
                            <SelectItem value="annual">Annual</SelectItem>
                            <SelectItem value="one-time">One-time</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Platforms */}
            <Card>
              <CardHeader>
                <CardTitle>Platforms</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {platforms.map(platform => (
                    <div key={platform.id} className="flex items-center space-x-2">
                      <Checkbox
                        id={platform.id}
                        checked={formData.platforms.includes(platform.id)}
                        onCheckedChange={() => togglePlatform(platform.id)}
                      />
                      <Label htmlFor={platform.id}>{platform.label}</Label>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Features */}
            <Card>
              <CardHeader>
                <CardTitle>Features</CardTitle>
              </CardHeader>
              <CardContent>
                {formData.features.map((feature, index) => (
                  <div key={index} className="flex gap-2 mb-2">
                    <Input
                      value={feature}
                      onChange={(e) => updateArrayItem('features', index, e.target.value)}
                      placeholder="Enter a key feature"
                    />
                    {formData.features.length > 1 && (
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => removeArrayItem('features', index)}
                      >
                        <X className="w-4 h-4" />
                      </Button>
                    )}
                  </div>
                ))}
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => addArrayItem('features')}
                  className="mt-2"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Add Feature
                </Button>
              </CardContent>
            </Card>

            {/* Submitter Information */}
            <Card>
              <CardHeader>
                <CardTitle>Your Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="submitterName">Your Name *</Label>
                    <Input
                      id="submitterName"
                      required
                      value={formData.submitterName}
                      onChange={(e) => updateFormData('submitterName', e.target.value)}
                    />
                  </div>
                  <div>
                    <Label htmlFor="submitterEmail">Your Email *</Label>
                    <Input
                      id="submitterEmail"
                      type="email"
                      required
                      value={formData.submitterEmail}
                      onChange={(e) => updateFormData('submitterEmail', e.target.value)}
                    />
                  </div>
                </div>
                <div>
                  <Label htmlFor="relationship">Relationship to Tool *</Label>
                  <Select value={formData.relationship} onValueChange={(value) => updateFormData('relationship', value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select your relationship" />
                    </SelectTrigger>
                    <SelectContent>
                      {relationships.map(rel => (
                        <SelectItem key={rel} value={rel}>{rel}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>
            </Card>

            <div className="flex justify-end gap-4">
              <Button type="button" variant="outline" onClick={() => window.history.back()}>
                Cancel
              </Button>
              <Button type="submit" disabled={isSubmitting} className="bg-gradient-primary">
                {isSubmitting ? (
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin" />
                    Submitting...
                  </div>
                ) : (
                  <div className="flex items-center gap-2">
                    <Send className="w-4 h-4" />
                    Submit Tool
                  </div>
                )}
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default SubmitTool;
