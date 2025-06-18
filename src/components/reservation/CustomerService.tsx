
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { MessageCircle } from "lucide-react";
import { Link } from "react-router-dom";

export const CustomerService = () => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>1:1 온라인 문의</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <p className="text-sm text-gray-600">
            평일 AM 10:00 - PM 06:00 주말 · 공휴일 휴무
          </p>
          <Link to="/inquiry">
            <Button variant="outline" className="flex items-center justify-center space-x-2 w-full">
              <MessageCircle className="w-4 h-4" />
              <span>1:1 문의하기</span>
            </Button>
          </Link>
        </div>
      </CardContent>
    </Card>
  );
};
