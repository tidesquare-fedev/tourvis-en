
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { MessageCircle, Phone, Mail } from "lucide-react";

export const CustomerService = () => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>1:1 Online Inquiry</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <p className="text-sm text-gray-600">
            Need help with your reservation? Our customer service team is here to assist you.
          </p>
          <div className="grid gap-3">
            <Button variant="outline" className="flex items-center justify-start space-x-2">
              <MessageCircle className="w-4 h-4" />
              <span>Start Live Chat</span>
            </Button>
            <Button variant="outline" className="flex items-center justify-start space-x-2">
              <Phone className="w-4 h-4" />
              <span>Call Us: +82-2-1234-5678</span>
            </Button>
            <Button variant="outline" className="flex items-center justify-start space-x-2">
              <Mail className="w-4 h-4" />
              <span>Email: support@koreatours.com</span>
            </Button>
          </div>
          <div className="text-xs text-gray-500 mt-4">
            <p>Business Hours: 9:00 AM - 6:00 PM (KST)</p>
            <p>Response Time: Within 24 hours</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
