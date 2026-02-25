'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { 
  HelpCircle, 
  Book, 
  MessageCircle, 
  Mail, 
  FileText, 
  Video,
  ExternalLink,
  Send
} from 'lucide-react';
import { useState } from 'react';

export default function HelpPage() {
  const [formData, setFormData] = useState({
    subject: '',
    message: '',
    email: '',
  });
  const [isSending, setIsSending] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSending(true);
    
    // Simulate sending
    setTimeout(() => {
      alert('Your message has been sent! We\'ll get back to you soon.');
      setFormData({ subject: '', message: '', email: '' });
      setIsSending(false);
    }, 1000);
  };

  const helpResources = [
    {
      icon: Book,
      title: 'Documentation',
      description: 'Browse our comprehensive guides and tutorials',
      link: '#',
      color: 'from-blue-600 to-cyan-600',
    },
    {
      icon: Video,
      title: 'Video Tutorials',
      description: 'Watch step-by-step video guides',
      link: '#',
      color: 'from-cyan-500 to-teal-500',
    },
    {
      icon: MessageCircle,
      title: 'Community Forum',
      description: 'Connect with other users and share tips',
      link: '#',
      color: 'from-green-600 to-emerald-600',
    },
    {
      icon: FileText,
      title: 'FAQ',
      description: 'Find answers to commonly asked questions',
      link: '#',
      color: 'from-amber-600 to-orange-600',
    },
  ];

  const faqs = [
    {
      question: 'How do I create a new project?',
      answer: 'Navigate to the Projects page and click the "New Project" button. Fill in the project details and add team members if needed.',
    },
    {
      question: 'How do I assign tasks to team members?',
      answer: 'When creating or editing a task, select the project first, then choose a team member from the "Assign To" dropdown.',
    },
    {
      question: 'Can I receive notifications for task updates?',
      answer: 'Yes! Enable browser notifications when prompted. You\'ll receive real-time alerts for task assignments, completions, and deadline reminders.',
    },
    {
      question: 'How do I change my password?',
      answer: 'Go to Account Settings, click "Edit Profile", and fill in the password change section with your current and new password.',
    },
    {
      question: 'What do the priority levels mean?',
      answer: 'Low (blue) for non-urgent tasks, Medium (amber) for standard priority, and High (red) for urgent tasks that need immediate attention.',
    },
  ];

  return (
    <div className="space-y-6 max-w-6xl">
      <div>
        <h1 className="text-3xl font-bold bg-gradient-to-r from-cyan-400 to-teal-400 bg-clip-text text-transparent">
          Help & Support
        </h1>
        <p className="text-slate-400 mt-1">Get help and learn how to use PRO effectively</p>
      </div>

      {/* Quick Help Resources */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {helpResources.map((resource) => (
          <Card key={resource.title} className="glass-effect border-cyan-500/20 hover:border-cyan-500/40 transition-all group cursor-pointer">
            <CardContent className="pt-6">
              <div className={`h-12 w-12 rounded-lg bg-gradient-to-br ${resource.color} flex items-center justify-center mb-4 shadow-lg group-hover:scale-110 transition-transform`}>
                <resource.icon className="h-6 w-6 text-white" />
              </div>
              <h3 className="font-semibold text-slate-200 mb-2">{resource.title}</h3>
              <p className="text-sm text-slate-400 mb-3">{resource.description}</p>
              <Button variant="ghost" size="sm" className="text-cyan-400 hover:text-cyan-300 p-0 h-auto">
                Learn more <ExternalLink className="h-3 w-3 ml-1" />
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* FAQ Section */}
      <Card className="glass-effect border-cyan-500/20">
        <CardHeader>
          <CardTitle className="text-slate-200 flex items-center gap-2">
            <HelpCircle className="h-5 w-5 text-cyan-400" />
            Frequently Asked Questions
          </CardTitle>
          <CardDescription>Quick answers to common questions</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {faqs.map((faq, index) => (
            <div key={index} className="pb-4 border-b border-slate-700/50 last:border-0 last:pb-0">
              <h4 className="font-semibold text-slate-200 mb-2">{faq.question}</h4>
              <p className="text-sm text-slate-400 leading-relaxed">{faq.answer}</p>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Contact Support */}
      <Card className="glass-effect border-cyan-500/20">
        <CardHeader>
          <CardTitle className="text-slate-200 flex items-center gap-2">
            <Mail className="h-5 w-5 text-cyan-400" />
            Contact Support
          </CardTitle>
          <CardDescription>Can&apos;t find what you&apos;re looking for? Send us a message</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="email" className="text-slate-300">Your Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  placeholder="your.email@example.com"
                  required
                  className="bg-slate-800/50 border-slate-700"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="subject" className="text-slate-300">Subject</Label>
                <Input
                  id="subject"
                  value={formData.subject}
                  onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                  placeholder="What do you need help with?"
                  required
                  className="bg-slate-800/50 border-slate-700"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="message" className="text-slate-300">Message</Label>
              <Textarea
                id="message"
                value={formData.message}
                onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                placeholder="Describe your issue or question in detail..."
                rows={6}
                required
                className="bg-slate-800/50 border-slate-700"
              />
            </div>

            <div className="flex justify-end">
              <Button
                type="submit"
                disabled={isSending}
                className="bg-gradient-to-r from-cyan-500 to-teal-500 hover:from-cyan-600 hover:to-teal-600"
              >
                <Send className="h-4 w-4 mr-2" />
                {isSending ? 'Sending...' : 'Send Message'}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>

      {/* Additional Support Info */}
      <Card className="glass-effect border-cyan-500/20 bg-gradient-to-br from-cyan-500/10 to-teal-500/10">
        <CardContent className="pt-6">
          <div className="flex items-start gap-4">
            <div className="h-12 w-12 rounded-full bg-gradient-to-br from-cyan-500 to-teal-500 flex items-center justify-center flex-shrink-0">
              <MessageCircle className="h-6 w-6 text-white" />
            </div>
            <div>
              <h3 className="font-semibold text-slate-200 mb-2">Need immediate assistance?</h3>
              <p className="text-sm text-slate-400 mb-3">
                Our support team is available Monday to Friday, 9 AM - 6 PM EST. We typically respond within 24 hours.
              </p>
              <div className="flex gap-4 text-sm">
                <a href="mailto:support@pro-app.com" className="text-cyan-400 hover:text-cyan-300 flex items-center gap-1">
                  <Mail className="h-4 w-4" />
                  support@pro-app.com
                </a>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
