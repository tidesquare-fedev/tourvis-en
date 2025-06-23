
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import ProductList from "./pages/ProductList";
import TourDetail from "./pages/TourDetail";
import BookingInfo from "./pages/BookingInfo";
import BookingConfirmation from "./pages/BookingConfirmation";
import ReservationLookup from "./pages/ReservationLookup";
import ReservationDetails from "./pages/ReservationDetails";
import Inquiry from "./pages/Inquiry";
import InquiryList from "./pages/InquiryList";
import InquiryDetail from "./pages/InquiryDetail";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/products" element={<ProductList />} />
          <Route path="/tour/:id" element={<TourDetail />} />
          <Route path="/booking-info" element={<BookingInfo />} />
          <Route path="/booking-confirmation" element={<BookingConfirmation />} />
          <Route path="/reservation-lookup" element={<ReservationLookup />} />
          <Route path="/reservation-details" element={<ReservationDetails />} />
          <Route path="/inquiry" element={<Inquiry />} />
          <Route path="/inquiry-list" element={<InquiryList />} />
          <Route path="/inquiry-detail/:id" element={<InquiryDetail />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
