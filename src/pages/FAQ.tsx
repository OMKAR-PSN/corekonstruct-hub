import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import Navbar from "@/components/Navbar";
import { HardHat } from "lucide-react";

const faqData = [
  {
    category: "General",
    items: [
      { q: "What is CoreKonstruct?", a: "CoreKonstruct is an all-in-one construction management platform that helps supervisors, contractors, clients, and workers collaborate efficiently on construction projects." },
      { q: "Who can use CoreKonstruct?", a: "Anyone involved in construction — admins, supervisors, contractors, clients, and workers. Each role gets a personalized dashboard." },
      { q: "Is CoreKonstruct free?", a: "We offer a free tier to get started. Contact us for enterprise pricing." },
    ],
  },
  {
    category: "Attendance",
    items: [
      { q: "How do I mark attendance?", a: "Supervisors can mark attendance from their dashboard. Workers can also self check-in with GPS verification from their dashboard." },
      { q: "What if GPS is not available?", a: "GPS is recommended for verification. If unavailable, the supervisor can manually mark attendance with a note." },
      { q: "Can I view attendance history?", a: "Yes, all roles can view their relevant attendance history from the Attendance section." },
    ],
  },
  {
    category: "Materials",
    items: [
      { q: "How do I log materials?", a: "Navigate to the Materials section in your supervisor dashboard, fill in the material name, quantity, and unit, then submit." },
      { q: "Can contractors see material usage?", a: "Yes, contractors can view material logs for all their assigned sites." },
    ],
  },
  {
    category: "Technical",
    items: [
      { q: "What browsers are supported?", a: "CoreKonstruct works on all modern browsers — Chrome, Firefox, Safari, and Edge." },
      { q: "Is my data secure?", a: "Yes, we use enterprise-grade security with row-level policies. Each user can only access data they're authorized to see." },
      { q: "Can I use it on mobile?", a: "Absolutely! CoreKonstruct is fully responsive and works on phones and tablets — perfect for on-site use." },
    ],
  },
];

const FAQ = () => (
  <div className="min-h-screen bg-background">
    <Navbar />
    <div className="container pt-28 pb-16 max-w-3xl">
      <div className="text-center mb-12">
        <HardHat className="h-10 w-10 text-primary mx-auto mb-4" />
        <h1 className="text-3xl md:text-4xl font-bold">Help & FAQ</h1>
        <p className="mt-3 text-muted-foreground">Find answers to common questions about CoreKonstruct.</p>
      </div>

      {faqData.map((section) => (
        <div key={section.category} className="mb-8">
          <h2 className="text-lg font-display font-semibold text-primary mb-3">{section.category}</h2>
          <Accordion type="single" collapsible className="space-y-2">
            {section.items.map((item, i) => (
              <AccordionItem key={i} value={`${section.category}-${i}`} className="border border-border/50 rounded-lg px-4 bg-card/50">
                <AccordionTrigger className="text-sm font-medium hover:no-underline">{item.q}</AccordionTrigger>
                <AccordionContent className="text-sm text-muted-foreground">{item.a}</AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      ))}
    </div>
  </div>
);

export default FAQ;
