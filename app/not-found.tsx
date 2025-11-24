import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { FileQuestion } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center p-6">
      <Card className="max-w-md bg-white/5 backdrop-blur-sm border-white/10">
        <CardHeader>
          <div className="flex items-center gap-2 mb-2">
            <FileQuestion className="h-6 w-6 text-purple-400" />
            <CardTitle className="text-white">Page Not Found</CardTitle>
          </div>
          <CardDescription className="text-gray-400">
            The page you're looking for doesn't exist or has been moved.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Link href="/">
            <Button className="w-full bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700">
              Go Home
            </Button>
          </Link>
        </CardContent>
      </Card>
    </div>
  );
}
