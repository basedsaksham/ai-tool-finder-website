import Header from "@/components/Header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Star, 
  Users, 
  Search, 
  Zap, 
  Shield, 
  Heart,
  Mail,
  Github,
  Twitter
} from "lucide-react";

const About = () => {
  const features = [
    {
      icon: Search,
      title: "Smart Discovery",
      description: "Find the perfect AI tools with our intelligent search and filtering system."
    },
    {
      icon: Star,
      title: "Verified Reviews",
      description: "Real user reviews and ratings to help you make informed decisions."
    },
    {
      icon: Zap,
      title: "Always Updated", 
      description: "We continuously update our database with the latest AI tools and features."
    },
    {
      icon: Shield,
      title: "Trusted Source",
      description: "Carefully curated tools from reputable sources and verified developers."
    }
  ];

  const stats = [
    { label: "AI Tools Listed", value: "500+" },
    { label: "Categories", value: "15+" },
    { label: "Monthly Users", value: "50K+" },
    { label: "User Reviews", value: "10K+" }
  ];

  const team = [
    {
      name: "AI Tool Finder Team",
      role: "Creators & Maintainers",
      description: "Passionate about helping people discover the best AI tools for their needs."
    }
  ];

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <div className="container mx-auto px-4 py-8">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <div className="w-16 h-16 bg-gradient-primary rounded-2xl flex items-center justify-center mx-auto mb-6">
            <Star className="w-8 h-8 text-primary-foreground" fill="currentColor" />
          </div>
          <h1 className="text-4xl font-bold bg-gradient-primary bg-clip-text text-transparent mb-4">
            About AI Tool Finder
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
            Your comprehensive platform for discovering, comparing, and choosing the best AI tools 
            for your creative and professional needs.
          </p>
        </div>

        {/* Mission Section */}
        <div className="mb-16">
          <Card className="border-border bg-card/50 backdrop-blur">
            <CardHeader>
              <CardTitle className="text-2xl text-center">Our Mission</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-lg text-muted-foreground text-center max-w-3xl mx-auto leading-relaxed">
                We believe AI tools should be accessible to everyone. Our mission is to democratize 
                AI by helping people discover the perfect tools for their unique needs, whether you're 
                a creative professional, developer, business owner, or someone just getting started 
                with AI technology.
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Stats Section */}
        <div className="mb-16">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {stats.map((stat, index) => (
              <Card key={index} className="text-center border-border bg-card/50 backdrop-blur">
                <CardContent className="pt-6">
                  <div className="text-2xl font-bold bg-gradient-primary bg-clip-text text-transparent mb-2">
                    {stat.value}
                  </div>
                  <p className="text-sm text-muted-foreground">{stat.label}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Features Section */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-center mb-8">What Makes Us Different</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <Card key={index} className="border-border bg-card/50 backdrop-blur hover:shadow-glow transition-all duration-300">
                  <CardHeader>
                    <div className="w-12 h-12 bg-gradient-primary rounded-lg flex items-center justify-center mb-4">
                      <Icon className="w-6 h-6 text-primary-foreground" />
                    </div>
                    <CardTitle className="text-lg">{feature.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground">{feature.description}</p>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>

        {/* How It Works Section */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-center mb-8">How It Works</h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-primary rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-primary-foreground">1</span>
              </div>
              <h3 className="text-xl font-semibold mb-2">Browse & Search</h3>
              <p className="text-muted-foreground">
                Explore our curated collection of AI tools across various categories or search for specific solutions.
              </p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-primary rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-primary-foreground">2</span>
              </div>
              <h3 className="text-xl font-semibold mb-2">Compare & Evaluate</h3>
              <p className="text-muted-foreground">
                Compare features, pricing, and user reviews to find tools that match your requirements.
              </p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-primary rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-primary-foreground">3</span>
              </div>
              <h3 className="text-xl font-semibold mb-2">Choose & Implement</h3>
              <p className="text-muted-foreground">
                Make informed decisions and start using the AI tools that will transform your workflow.
              </p>
            </div>
          </div>
        </div>

        {/* Categories We Cover */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-center mb-8">Categories We Cover</h2>
          <div className="flex flex-wrap justify-center gap-3">
            {[
              "Text & Writing",
              "Image & Design", 
              "Video & Media",
              "Development",
              "Productivity",
              "Music & Audio",
              "Analytics",
              "Marketing",
              "Customer Service",
              "Education",
              "Healthcare",
              "Finance",
              "E-commerce",
              "Social Media",
              "Translation"
            ].map((category) => (
              <Badge key={category} variant="secondary" className="text-sm py-2 px-4">
                {category}
              </Badge>
            ))}
          </div>
        </div>

        {/* Team Section */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-center mb-8">Our Team</h2>
          <div className="max-w-2xl mx-auto">
            {team.map((member, index) => (
              <Card key={index} className="border-border bg-card/50 backdrop-blur">
                <CardContent className="pt-6 text-center">
                  <div className="w-20 h-20 bg-gradient-primary rounded-full flex items-center justify-center mx-auto mb-4">
                    <Users className="w-10 h-10 text-primary-foreground" />
                  </div>
                  <h3 className="text-xl font-semibold mb-2">{member.name}</h3>
                  <p className="text-primary mb-3">{member.role}</p>
                  <p className="text-muted-foreground">{member.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Contact Section */}
        <div className="mb-16">
          <Card className="border-border bg-gradient-to-br from-card/80 to-card/40 backdrop-blur">
            <CardHeader>
              <CardTitle className="text-2xl text-center">Get In Touch</CardTitle>
            </CardHeader>
            <CardContent className="text-center space-y-6">
              <p className="text-muted-foreground max-w-2xl mx-auto">
                Have a question, suggestion, or want to submit a new AI tool? We'd love to hear from you!
              </p>
              
              <div className="flex justify-center gap-4">
                <Button variant="outline" className="flex items-center gap-2">
                  <Mail className="w-4 h-4" />
                  Contact Us
                </Button>
                <Button variant="outline" className="flex items-center gap-2">
                  <Github className="w-4 h-4" />
                  GitHub
                </Button>
                <Button variant="outline" className="flex items-center gap-2">
                  <Twitter className="w-4 h-4" />
                  Twitter
                </Button>
              </div>

              <div className="pt-6 border-t border-border">
                <p className="text-sm text-muted-foreground flex items-center justify-center gap-2">
                  Made with <Heart className="w-4 h-4 text-red-500" fill="currentColor" /> for the AI community
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default About;
