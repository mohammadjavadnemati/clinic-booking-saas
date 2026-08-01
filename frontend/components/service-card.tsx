import Link from "next/link";
import { Service } from "@/lib/types";
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

interface ServiceCardProps {
  service: Service;
  businessId: string;
}

export function ServiceCard({ service, businessId }: ServiceCardProps) {
  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg">{service.name}</CardTitle>
          <Badge variant="secondary">${service.price.toFixed(2)}</Badge>
        </div>
      </CardHeader>
      <CardContent>
        {service.description && (
          <p className="text-sm text-gray-500">{service.description}</p>
        )}
        <p className="mt-2 text-sm text-gray-400">
          Duration: {service.durationMinutes} min
        </p>
      </CardContent>
      <CardFooter>
        <Button asChild size="sm">
          <Link href={`/business/${businessId}/book?serviceId=${service.id}`}>
            Book Now
          </Link>
        </Button>
      </CardFooter>
    </Card>
  );
}