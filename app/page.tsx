import { AuthButton } from "@/components/auth-button";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Sparkles, Search, Upload, Music, Image as ImageIcon, FileText, Zap, Globe, Lock } from "lucide-react";
import Link from "next/link";

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-background to-background/50">
      {/* Navigation */}
      <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-16 max-w-screen-2xl items-center justify-between px-4">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center">
              <Sparkles className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-bold tracking-tight">STAGE</span>
          </div>
          <nav className="hidden md:flex items-center gap-6 text-sm font-medium">
            <Link href="/discovery" className="transition-colors hover:text-primary">Discovery</Link>
            <Link href="/upload" className="transition-colors hover:text-primary">Upload</Link>
            <Link href="/profile" className="transition-colors hover:text-primary">Profile</Link>
          </nav>
          <div className="flex items-center gap-4">
            <AuthButton />
          </div>
        </div>
      </header>

      <main className="flex-1">
        {/* Hero Section */}
        <section className="relative py-20 md:py-32 overflow-hidden">
          <div className="absolute inset-0 bg-[url('/grid.svg')] bg-center [mask-image:linear-gradient(180deg,white,rgba(255,255,255,0))]" />
          <div className="container relative z-10 px-4 text-center">
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
        <section className="py-24 bg-gradient-to-b from-slate-900/50 to-slate-950">
          <div className="container px-4">
            <div className="text-center mb-16">
              <h2 className="text-4xl md:text-5xl font-black text-slate-100 mb-4">
                Your Content Deserves Discovery
              </h2>
              <p className="text-xl text-slate-400 max-w-2xl mx-auto">
                Whether you create music, art, or written content, STAGE finds your audience.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <Card className="group relative overflow-hidden border-slate-700/50 bg-gradient-to-br from-slate-800/50 to-slate-900/50 backdrop-blur hover:border-orange-500/30 transition-all hover:shadow-orange-500/10 hover:shadow-2xl">
                <div className="absolute inset-0 bg-gradient-to-br from-orange-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
                <CardHeader className="relative z-10">
                  <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-orange-500/30 to-orange-600/20 flex items-center justify-center mb-4 group-hover:from-orange-500/50 group-hover:to-orange-600/40 transition-all">
                    <Music className="w-6 h-6 text-orange-400" />
                  </div>
                  <CardTitle className="text-slate-100">Music & Audio</CardTitle>
                </CardHeader>
                <CardContent className="relative z-10">
                  <p className="text-slate-400 leading-relaxed">
                    Upload your tracks and let our AI analyze vibe, genre, and instruments to match you with engaged listeners.
                  </p>
                </CardContent>
              </Card>

              <Card className="group relative overflow-hidden border-slate-700/50 bg-gradient-to-br from-slate-800/50 to-slate-900/50 backdrop-blur hover:border-orange-500/30 transition-all hover:shadow-orange-500/10 hover:shadow-2xl">
                <div className="absolute inset-0 bg-gradient-to-br from-orange-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
                <CardHeader className="relative z-10">
                  <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-orange-500/30 to-orange-600/20 flex items-center justify-center mb-4 group-hover:from-orange-500/50 group-hover:to-orange-600/40 transition-all">
                    <ImageIcon className="w-6 h-6 text-orange-400" />
                  </div>
                  <CardTitle className="text-slate-100">Visual Art</CardTitle>
                </CardHeader>
                <CardContent className="relative z-10">
                  <p className="text-slate-400 leading-relaxed">
                    Mint your digital art and designs. Our semantic search understands image content, not just tags.
                  </p>
                </CardContent>
              </Card>

              <Card className="group relative overflow-hidden border-slate-700/50 bg-gradient-to-br from-slate-800/50 to-slate-900/50 backdrop-blur hover:border-orange-500/30 transition-all hover:shadow-orange-500/10 hover:shadow-2xl">
                <div className="absolute inset-0 bg-gradient-to-br from-orange-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
                <CardHeader className="relative z-10">
                  <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-orange-500/30 to-orange-600/20 flex items-center justify-center mb-4 group-hover:from-orange-500/50 group-hover:to-orange-600/40 transition-all">
                    <FileText className="w-6 h-6 text-orange-400" />
                  </div>
                  <CardTitle className="text-slate-100">Written Content</CardTitle>
                </CardHeader>
                <CardContent className="relative z-10">
                  <p className="text-slate-400 leading-relaxed">
                    Publish articles and stories. Get discovered by readers looking for exactly what you wrote.
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* Benefits Section */}
        <section className="py-24 bg-slate-950">
          <div className="container px-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="flex gap-4">
                <div className="flex-shrink-0">
                  <div className="flex items-center justify-center h-12 w-12 rounded-md bg-orange-500/20 text-orange-400">
                    <Lock className="h-6 w-6" />
                  </div>
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-slate-100 mb-2">Ownership Matters</h3>
                  <p className="text-slate-400">
                    Your IP is truly yours. Minted as an NFT on Camp Network blockchain.
                  </p>
                </div>
              </div>

              <div className="flex gap-4">
                <div className="flex-shrink-0">
                  <div className="flex items-center justify-center h-12 w-12 rounded-md bg-orange-500/20 text-orange-400">
                    <Zap className="h-6 w-6" />
                  </div>
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-slate-100 mb-2">AI-Powered Discovery</h3>
                  <p className="text-slate-400">
                    Semantic search finds your content for people who actually want it.
                  </p>
                </div>
              </div>

              <div className="flex gap-4">
                <div className="flex-shrink-0">
                  <div className="flex items-center justify-center h-12 w-12 rounded-md bg-orange-500/20 text-orange-400">
                    <Globe className="h-6 w-6" />
                  </div>
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-slate-100 mb-2">Global Royalties</h3>
                  <p className="text-slate-400">
                    Earn real royalties every time someone accesses your content.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-20 bg-gradient-to-r from-orange-600/10 via-orange-500/5 to-slate-950 border-t border-orange-500/20">
          <div className="container px-4 text-center">
            <h2 className="text-3xl md:text-4xl font-black text-slate-100 mb-4">
              Ready to Get Discovered?
            </h2>
            <p className="text-lg text-slate-400 mb-8 max-w-2xl mx-auto">
              Join creators who are earning real income from their work on Camp Network.
            </p>
            <Link href="/upload">
              <Button size="lg" className="bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white px-10 h-13 text-lg shadow-lg hover:shadow-orange-500/50 transition-all">
                Start Creating
              </Button>
            </Link>
          </div>
        </section>
      </main>
    </div>
  );
}
