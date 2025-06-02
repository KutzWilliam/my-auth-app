import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import Link from "next/link";

interface AuthFormCardProps {
  title: string;
  description: string;
  children: React.ReactNode;
  footerLinkHref: string;
  footerLinkText: string;
  footerText?: string;
}

export function AuthFormCard({
  title,
  description,
  children,
  footerLinkHref,
  footerLinkText,
  footerText
}: AuthFormCardProps) {
  return (
    <Card className="w-full max-w-md">
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent>
        {children}
      </CardContent>
      {footerText && (
        <CardFooter className="text-sm justify-center">
          {footerText}{' '}
          <Link href={footerLinkHref} className="font-medium text-primary hover:underline">
            {footerLinkText}
          </Link>
        </CardFooter>
      )}
    </Card>
  );
}