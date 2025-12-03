import { AuthButton } from "@/components/auth-button";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Sparkles, Search, Upload, Music, Image as ImageIcon, FileText, Zap, Globe, Lock } from "lucide-react";
import Link from "next/link";

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-background to-background/50">
      <main className="flex-1">
        {/* Hero Section */}
        <section className="relative py-20 md:py-32 overflow-hidden">
          <div className="absolute inset-0 bg-[url('/grid.svg')] bg-center [mask-image:linear-gradient(180deg,white,rgba(255,255,255,0))]" />
          <div className="container mx-auto max-w-screen-2xl relative z-10 px-4 text-center">
            <div className="inline-flex items-center rounded-full border border-primary/20 bg-primary/10 px-3 py-1 text-sm font-medium text-primary mb-8 backdrop-blur-sm">
              <span className="flex h-2 w-2 rounded-full bg-primary mr-2 animate-pulse"></span>
              Powered by Camp Network
            </div>
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold tracking-tight mb-6 bg-clip-text text-transparent bg-gradient-to-r from-white to-white/60">
              Talent Discovery <br />
              <span className="text-primary">Decentralized.</span>
            </h1>
            <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto mb-10">
              The first AI-powered platform where visibility is earned by relevance, not popularity.
              Mint your IP, get discovered, and earn royalties.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link href="/discovery">
                <Button size="lg" className="w-full sm:w-auto text-lg h-12 px-8">
                  <Search className="mr-2 w-5 h-5" />
                  Start Discovering
                </Button>
              </Link>
              <Link href="/upload">
                <Button size="lg" variant="outline" className="w-full sm:w-auto text-lg h-12 px-8 glass hover:bg-white/20">
                  <Upload className="mr-2 w-5 h-5" />
                  Upload Content
                </Button>
              </Link>
            </div>
          </div>
        </section>

        {/* Features Grid */}
        <section className="py-20 bg-secondary/20">
          <div className="container mx-auto max-w-screen-2xl px-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <Card className="glass-card border-primary/10">
                <CardHeader>
                  <Music className="w-10 h-10 text-primary mb-4" />
                  <CardTitle>Music & Audio</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">
                    Upload your tracks and let our AI analyze the vibe, genre, and instruments to match you with the right listeners.
                  </p>
                </CardContent>
              </Card>
              <Card className="glass-card border-primary/10">
                <CardHeader>
                  <ImageIcon className="w-10 h-10 text-primary mb-4" />
                  <CardTitle>Visual Art</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">
                    Mint your digital art and designs. Our semantic search understands the content of your images, not just the tags.
                  </p>
                </CardContent>
              </Card>
              <Card className="glass-card border-primary/10">
                <CardHeader>
                  <FileText className="w-10 h-10 text-primary mb-4" />
                  <CardTitle>Written Content</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">
                    Publish articles, tutorials, and stories. Get discovered by readers looking for exactly what you wrote.
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
