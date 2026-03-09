import { Phone, MessageCircle, Mail, Linkedin } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="w-full mt-auto py-6 px-4 md:px-6 lg:px-8 border-t border-border bg-card/30">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-center items-center md:items-start gap-6">

        {/* Right Side - Contact */}
        <div className="flex flex-col items-center md:items-center space-y-2">
          <div className="text-sm font-medium text-foreground text-center md:text-right">
            Ahmed Abo-Raya <span className="text-muted-foreground font-normal sm:hidden"><br /></span>
            <span className="text-muted-foreground font-normal hidden sm:inline"> | </span>
            <span className="text-muted-foreground font-normal">Full Stack Engineer</span>
          </div>

          <div className="flex items-center gap-3 text-muted-foreground">
            <a
              href="tel:+201153782020"
              className="hover:text-foreground transition-colors p-1.5 rounded-md hover:bg-muted"
              title="Phone: +201153782020"
            >
              <Phone className="w-4 h-4" />
              <span className="sr-only">Phone</span>
            </a>

            <a
              href="https://wa.me/201153782020"
              target="_blank"
              rel="noreferrer"
              className="hover:text-foreground transition-colors p-1.5 rounded-md hover:bg-muted"
              title="WhatsApp: +201153782020"
            >
              <MessageCircle className="w-4 h-4" />
              <span className="sr-only">WhatsApp</span>
            </a>

            <a
              href="mailto:ahmedaboraya399@gmail.com"
              className="hover:text-foreground transition-colors p-1.5 rounded-md hover:bg-muted"
              title="Email: ahmedaboraya399@gmail.com"
            >
              <Mail className="w-4 h-4" />
              <span className="sr-only">Email</span>
            </a>

            <a
              href="https://www.linkedin.com/in/ahmed-abo-raya"
              target="_blank"
              rel="noreferrer"
              className="hover:text-foreground transition-colors p-1.5 rounded-md hover:bg-muted"
              title="LinkedIn"
            >
              <Linkedin className="w-4 h-4" />
              <span className="sr-only">LinkedIn</span>
            </a>

          </div>
          {/* <p className="text-xs text-muted-foreground">
            © 2026 Ahmed Abo-Raya — Full Stack Engineer
          </p> */}
        </div>

      </div>
    </footer>
  );
}
