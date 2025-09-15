import { Metadata } from "next";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, FileText, ExternalLink, Code, Package } from "lucide-react";

export const metadata: Metadata = {
  title: "Licenses | FinTracker",
  description: "Open source licenses and attributions for FinTracker.",
};

export default function LicensesPage() {
  const openSourceLibraries = [
    {
      name: "Next.js",
      version: "15.0.0",
      license: "MIT",
      description: "React framework for production",
      url: "https://nextjs.org/",
      category: "Framework",
    },
    {
      name: "React",
      version: "18.3.0",
      license: "MIT",
      description: "JavaScript library for building user interfaces",
      url: "https://reactjs.org/",
      category: "Library",
    },
    {
      name: "TypeScript",
      version: "5.6.0",
      license: "Apache-2.0",
      description: "Typed superset of JavaScript",
      url: "https://www.typescriptlang.org/",
      category: "Language",
    },
    {
      name: "Tailwind CSS",
      version: "3.4.14",
      license: "MIT",
      description: "Utility-first CSS framework",
      url: "https://tailwindcss.com/",
      category: "Styling",
    },
    {
      name: "Radix UI",
      version: "1.1.0",
      license: "MIT",
      description: "Low-level UI primitives and components",
      url: "https://www.radix-ui.com/",
      category: "UI Components",
    },
    {
      name: "Lucide React",
      version: "0.446.0",
      license: "ISC",
      description: "Beautiful & consistent icon toolkit",
      url: "https://lucide.dev/",
      category: "Icons",
    },
    {
      name: "Recharts",
      version: "2.12.7",
      license: "MIT",
      description: "Composable charting library built on React components",
      url: "https://recharts.org/",
      category: "Charts",
    },
    {
      name: "Mongoose",
      version: "8.18.1",
      license: "MIT",
      description: "MongoDB object modeling for Node.js",
      url: "https://mongoosejs.com/",
      category: "Database",
    },
    {
      name: "Jose",
      version: "6.1.0",
      license: "MIT",
      description: "JavaScript module for JSON Web Almost Everything",
      url: "https://github.com/panva/jose",
      category: "Security",
    },
    {
      name: "Zod",
      version: "3.23.8",
      license: "MIT",
      description:
        "TypeScript-first schema validation with static type inference",
      url: "https://zod.dev/",
      category: "Validation",
    },
    {
      name: "Date-fns",
      version: "4.1.0",
      license: "MIT",
      description: "Modern JavaScript date utility library",
      url: "https://date-fns.org/",
      category: "Utility",
    },
    {
      name: "Framer Motion",
      version: "11.18.2",
      license: "MIT",
      description: "Production-ready motion library for React",
      url: "https://www.framer.com/motion/",
      category: "Animation",
    },
  ];

  const licenseTexts = {
    MIT: `Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.`,

    "Apache-2.0": `Licensed under the Apache License, Version 2.0 (the "License"); you may not use this file except in compliance with the License. You may obtain a copy of the License at http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software distributed under the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the License for the specific language governing permissions and limitations under the License.`,

    ISC: `Permission to use, copy, modify, and/or distribute this software for any purpose with or without fee is hereby granted, provided that the above copyright notice and this permission notice appear in all copies.

THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES WITH REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR ANY SPECIAL, DIRECT, INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES WHATSOEVER RESULTING FROM LOSS OF USE, DATA OR PROFITS, WHETHER IN AN ACTION OF CONTRACT, NEGLIGENCE OR OTHER TORTIOUS ACTION, ARISING OUT OF OR IN CONNECTION WITH THE USE OR PERFORMANCE OF THIS SOFTWARE.`,
  };

  const getCategoryColor = (category: string) => {
    const colors = {
      Framework:
        "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200",
      Library:
        "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200",
      Language:
        "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200",
      Styling: "bg-pink-100 text-pink-800 dark:bg-pink-900 dark:text-pink-200",
      "UI Components":
        "bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200",
      Icons:
        "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200",
      Charts:
        "bg-indigo-100 text-indigo-800 dark:bg-indigo-900 dark:text-indigo-200",
      Database: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200",
      Security: "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200",
      Validation:
        "bg-teal-100 text-teal-800 dark:bg-teal-900 dark:text-teal-200",
      Utility: "bg-cyan-100 text-cyan-800 dark:bg-cyan-900 dark:text-cyan-200",
      Animation:
        "bg-violet-100 text-violet-800 dark:bg-violet-900 dark:text-violet-200",
    };
    return (
      colors[category as keyof typeof colors] ||
      "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200"
    );
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center gap-4">
            <Link href="/">
              <Button variant="ghost" size="sm">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to Home
              </Button>
            </Link>
            <div className="flex items-center gap-2">
              <FileText className="h-5 w-5 text-primary" />
              <h1 className="text-xl font-semibold">Open Source Licenses</h1>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-16 bg-gradient-to-br from-primary/5 to-accent/5">
        <div className="container mx-auto px-4 text-center">
          <div className="max-w-3xl mx-auto">
            <Code className="h-16 w-16 text-primary mx-auto mb-6" />
            <h1 className="text-4xl font-bold mb-6">
              Built on <span className="text-primary">Open Source</span>
            </h1>
            <p className="text-xl text-muted-foreground mb-8">
              FinTracker is built with amazing open source libraries and tools.
              We're grateful to the developers and communities that make these
              projects possible.
            </p>
            <div className="flex items-center justify-center gap-4">
              <Badge variant="secondary" className="text-sm">
                <Package className="mr-2 h-4 w-4" />
                {openSourceLibraries.length} Dependencies
              </Badge>
              <Badge variant="secondary" className="text-sm">
                <Code className="mr-2 h-4 w-4" />
                Open Source
              </Badge>
            </div>
          </div>
        </div>
      </section>

      {/* Libraries List */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Third-Party Libraries</h2>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              These are the open source libraries and tools that power
              FinTracker. Each one is essential to delivering the best possible
              experience.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-7xl mx-auto">
            {openSourceLibraries.map((library, index) => (
              <Card key={index} className="h-full">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-lg">{library.name}</CardTitle>
                    <Badge className={getCategoryColor(library.category)}>
                      {library.category}
                    </Badge>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant="outline" className="text-xs">
                      v{library.version}
                    </Badge>
                    <Badge variant="outline" className="text-xs">
                      {library.license}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <CardDescription className="text-sm">
                    {library.description}
                  </CardDescription>
                  <Button
                    variant="outline"
                    size="sm"
                    asChild
                    className="w-full"
                  >
                    <Link
                      href={library.url}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <ExternalLink className="mr-2 h-4 w-4" />
                      View Project
                    </Link>
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* License Texts */}
      <section className="py-16 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold mb-4">License Texts</h2>
              <p className="text-muted-foreground text-lg">
                Full text of the licenses used by our dependencies.
              </p>
            </div>

            <div className="space-y-8">
              {Object.entries(licenseTexts).map(
                ([licenseName, licenseText]) => (
                  <Card key={licenseName}>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <FileText className="h-5 w-5 text-primary" />
                        {licenseName} License
                      </CardTitle>
                      <CardDescription>
                        Used by{" "}
                        {
                          openSourceLibraries.filter(
                            (lib) => lib.license === licenseName
                          ).length
                        }{" "}
                        libraries
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <pre className="text-sm bg-muted p-4 rounded-lg overflow-x-auto whitespace-pre-wrap">
                        {licenseText}
                      </pre>
                    </CardContent>
                  </Card>
                )
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Attribution */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-3xl font-bold mb-6">Attribution & Thanks</h2>
            <p className="text-muted-foreground text-lg mb-8">
              We extend our heartfelt gratitude to all the open source
              developers and communities who have made FinTracker possible. Your
              contributions to the open source ecosystem enable innovation and
              help build better software for everyone.
            </p>

            <div className="bg-muted/50 p-8 rounded-lg">
              <h3 className="text-xl font-semibold mb-4">Special Thanks</h3>
              <p className="text-muted-foreground mb-6">
                To the maintainers and contributors of React, Next.js, Tailwind
                CSS, and all the other amazing projects that make modern web
                development possible.
              </p>
              <Button asChild>
                <Link
                  href="https://github.com/fintracker"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <Code className="mr-2 h-4 w-4" />
                  View Our Code
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
