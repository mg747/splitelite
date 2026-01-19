'use client';

import { useState } from 'react';
import Link from 'next/link';
import { 
  ArrowLeft, 
  HelpCircle, 
  ChevronDown, 
  ChevronRight,
  Users,
  Receipt,
  CreditCard,
  Settings,
  Globe,
  Smartphone,
  Shield,
  Mail,
  Search,
  BookOpen,
  Zap,
  PieChart
} from 'lucide-react';

interface FAQItem {
  question: string;
  answer: string;
}

interface FAQCategory {
  id: string;
  title: string;
  icon: React.ElementType;
  items: FAQItem[];
}

const faqCategories: FAQCategory[] = [
  {
    id: 'getting-started',
    title: 'Getting Started',
    icon: Zap,
    items: [
      {
        question: 'How do I create an account?',
        answer: 'When you first open SplitElite, you\'ll see an onboarding flow. Enter your name and email to create an account, or click "Try Demo Mode" to explore with sample data. No password is required - we use secure, passwordless authentication.'
      },
      {
        question: 'What is Demo Mode?',
        answer: 'Demo Mode loads sample data including groups, members, and expenses so you can explore all features without entering your own data. It\'s perfect for trying out SplitElite before committing. You can clear demo data and start fresh anytime from Settings.'
      },
      {
        question: 'Is SplitElite free to use?',
        answer: 'Yes! SplitElite offers a generous free plan that includes creating groups, tracking expenses, splitting bills, and viewing balances. Pro features like analytics, receipt scanning, and unlimited groups are available with a paid subscription.'
      },
      {
        question: 'How do I invite friends to a group?',
        answer: 'When creating or editing a group, add members by entering their names and optional email addresses. Currently, members are added manually. Future updates will include invite links and email invitations.'
      }
    ]
  },
  {
    id: 'groups',
    title: 'Groups & Members',
    icon: Users,
    items: [
      {
        question: 'How do I create a group?',
        answer: 'Click the "+" button in the sidebar or "Create Group" button. Enter a group name, select a type (Trip, Home, Couple, Event, Work, or Other), and add members. Each group can have unlimited members on the Pro plan.'
      },
      {
        question: 'Can I edit a group after creating it?',
        answer: 'Yes! Open the group, click the gear icon (⚙️) next to "Add Expense", and select "Edit". You can change the group name, description, type, and add or remove members.'
      },
      {
        question: 'What happens when I delete a group?',
        answer: 'Deleting a group permanently removes all expenses, settlements, and member data associated with that group. This action cannot be undone, so please be certain before deleting.'
      },
      {
        question: 'Can someone be in multiple groups?',
        answer: 'Yes! The same person can be a member of multiple groups. Each group tracks expenses independently, so balances are calculated separately per group.'
      },
      {
        question: 'How do I remove a member from a group?',
        answer: 'Edit the group and click the trash icon next to the member you want to remove. Note: You cannot remove yourself from a group, and removing a member doesn\'t delete their associated expenses.'
      }
    ]
  },
  {
    id: 'expenses',
    title: 'Expenses & Splitting',
    icon: Receipt,
    items: [
      {
        question: 'How do I add an expense?',
        answer: 'Select a group, click "Add Expense", and fill in the details: description, amount, who paid, category, date, and who to split between. The split is calculated automatically based on selected members.'
      },
      {
        question: 'Can I split expenses unequally?',
        answer: 'Currently, expenses are split equally among selected members. Custom split amounts (percentages or exact amounts) are coming in a future update.'
      },
      {
        question: 'How do I edit or delete an expense?',
        answer: 'Hover over any expense in the list to reveal edit (pencil) and delete (trash) icons. Click the appropriate icon to modify or remove the expense.'
      },
      {
        question: 'What expense categories are available?',
        answer: 'SplitElite includes 9 categories: Food & Dining, Transport, Accommodation, Entertainment, Shopping, Utilities, Groceries, Health, and Other. Custom categories are available with Pro.'
      },
      {
        question: 'Can I add expenses in different currencies?',
        answer: 'Yes! Each expense can be recorded in any supported currency. SplitElite supports 12+ currencies including USD, EUR, GBP, JPY, CNY, and more.'
      }
    ]
  },
  {
    id: 'balances',
    title: 'Balances & Settlements',
    icon: CreditCard,
    items: [
      {
        question: 'How are balances calculated?',
        answer: 'Balances are calculated by comparing what each person paid versus what they owe. If you paid more than your share, you\'re owed money (positive balance). If you paid less, you owe money (negative balance).'
      },
      {
        question: 'What are suggested settlements?',
        answer: 'SplitElite uses a smart algorithm to minimize the number of payments needed to settle all debts. Instead of everyone paying everyone else, it suggests the optimal payment flow.'
      },
      {
        question: 'How do I mark a debt as paid?',
        answer: 'In the Balances tab, find the suggested settlement and click the checkmark button. This records the payment and updates everyone\'s balances accordingly.'
      },
      {
        question: 'Can I settle outside the app?',
        answer: 'Yes! SplitElite tracks what\'s owed, but actual payments happen outside the app (cash, Venmo, bank transfer, etc.). Just mark settlements as complete when payment is made.'
      },
      {
        question: 'Why doesn\'t my balance equal zero?',
        answer: 'Your balance reflects the net amount across all expenses. A non-zero balance means you either owe money to others or are owed money. Check the Balances tab for details.'
      }
    ]
  },
  {
    id: 'pro',
    title: 'Pro Features',
    icon: PieChart,
    items: [
      {
        question: 'What\'s included in Pro?',
        answer: 'Pro includes: Receipt scanning with AI extraction, advanced analytics and insights, data export (CSV, PDF, Excel), recurring expenses, payment reminders, unlimited groups, custom categories, and priority support.'
      },
      {
        question: 'How much does Pro cost?',
        answer: 'Pro is available as a monthly or annual subscription. Annual plans offer significant savings. Check the Upgrade page in the app for current pricing.'
      },
      {
        question: 'Can I cancel my Pro subscription?',
        answer: 'Yes, you can cancel anytime from Settings > Subscription. You\'ll retain Pro access until the end of your current billing period, then revert to the free plan.'
      },
      {
        question: 'Is there a free trial?',
        answer: 'We offer a 7-day money-back guarantee for new Pro subscriptions. If you\'re not satisfied, contact support within 7 days for a full refund.'
      },
      {
        question: 'How does receipt scanning work?',
        answer: 'Take a photo of a receipt, and our AI extracts the merchant name, amount, date, and category automatically. Review and edit the details before saving the expense.'
      }
    ]
  },
  {
    id: 'settings',
    title: 'Account & Settings',
    icon: Settings,
    items: [
      {
        question: 'How do I change my language?',
        answer: 'Go to Settings > General and select your preferred language. SplitElite supports 8 languages: English, Spanish, French, German, Chinese, Japanese, Portuguese, and Arabic.'
      },
      {
        question: 'How do I change my default currency?',
        answer: 'Go to Settings > General and select your preferred currency. This sets the default for new expenses, but you can still use any currency per expense.'
      },
      {
        question: 'What does "Freeze Account" do?',
        answer: 'Freezing temporarily disables your account while preserving all your data. You can unfreeze anytime to regain full access. This is useful if you need a break but don\'t want to lose your data.'
      },
      {
        question: 'How do I delete my account?',
        answer: 'Go to Settings > Account and click "Delete Account". This permanently deletes your account and all associated data. This action cannot be undone.'
      },
      {
        question: 'How do I sign out?',
        answer: 'Go to Settings > Account and click "Sign Out". Your data remains saved and you can sign back in anytime with the same email.'
      }
    ]
  },
  {
    id: 'mobile',
    title: 'Mobile App',
    icon: Smartphone,
    items: [
      {
        question: 'Is there a mobile app?',
        answer: 'SplitElite is a Progressive Web App (PWA) that can be installed on any device. It works like a native app with offline support, push notifications, and home screen access.'
      },
      {
        question: 'How do I install on iPhone/iPad?',
        answer: 'Open SplitElite in Safari, tap the Share button (square with arrow), scroll down and tap "Add to Home Screen", then tap "Add" to confirm.'
      },
      {
        question: 'How do I install on Android?',
        answer: 'Open SplitElite in Chrome, tap the menu (three dots), tap "Add to Home Screen" or "Install App", then tap "Install" to confirm.'
      },
      {
        question: 'Does it work offline?',
        answer: 'Yes! Once installed, SplitElite caches data locally so you can view expenses and balances offline. Changes sync automatically when you\'re back online.'
      },
      {
        question: 'Will there be native iOS/Android apps?',
        answer: 'We\'re evaluating native apps for the future. The current PWA provides a native-like experience on all platforms while we gather user feedback.'
      }
    ]
  },
  {
    id: 'privacy',
    title: 'Privacy & Security',
    icon: Shield,
    items: [
      {
        question: 'Is my data secure?',
        answer: 'Yes! We use industry-standard encryption (HTTPS/TLS) for all data transmission. Sensitive data is encrypted at rest. Payment processing is handled by Stripe, a PCI-compliant provider.'
      },
      {
        question: 'Who can see my expenses?',
        answer: 'Only members of a group can see expenses within that group. Your personal account information is never shared with other users.'
      },
      {
        question: 'Do you sell my data?',
        answer: 'No, we never sell your personal data. We only share data with service providers necessary to operate SplitElite (hosting, payments, etc.). See our Privacy Policy for details.'
      },
      {
        question: 'How long do you keep my data?',
        answer: 'We retain your data as long as your account is active. When you delete your account, we remove your personal data within 30 days, except where required by law.'
      },
      {
        question: 'Can I export my data?',
        answer: 'Pro users can export expenses as CSV, PDF, or Excel. You can also request a copy of all your data by contacting support.'
      }
    ]
  }
];

export default function HelpCenter() {
  const [searchQuery, setSearchQuery] = useState('');
  const [expandedCategory, setExpandedCategory] = useState<string | null>('getting-started');
  const [expandedQuestions, setExpandedQuestions] = useState<Set<string>>(new Set());

  const toggleQuestion = (categoryId: string, questionIndex: number) => {
    const key = `${categoryId}-${questionIndex}`;
    setExpandedQuestions(prev => {
      const newSet = new Set(prev);
      if (newSet.has(key)) {
        newSet.delete(key);
      } else {
        newSet.add(key);
      }
      return newSet;
    });
  };

  const filteredCategories = searchQuery
    ? faqCategories.map(category => ({
        ...category,
        items: category.items.filter(
          item =>
            item.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
            item.answer.toLowerCase().includes(searchQuery.toLowerCase())
        )
      })).filter(category => category.items.length > 0)
    : faqCategories;

  return (
    <div className="min-h-screen bg-dark-950">
      {/* Header */}
      <header className="border-b border-dark-700 bg-dark-900/50 backdrop-blur-sm sticky top-0 z-10">
        <div className="max-w-6xl mx-auto px-4 py-4 flex items-center gap-4">
          <Link 
            href="/"
            className="p-2 rounded-lg hover:bg-dark-800 text-dark-400 hover:text-white transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-primary-500/20">
              <HelpCircle className="w-5 h-5 text-primary-400" />
            </div>
            <h1 className="text-xl font-bold text-white">Help Center</h1>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="bg-gradient-to-b from-dark-900 to-dark-950 py-12 px-4">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            How can we help you?
          </h2>
          <p className="text-dark-400 mb-8">
            Search our knowledge base or browse categories below
          </p>
          
          {/* Search */}
          <div className="relative max-w-xl mx-auto">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-dark-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search for answers..."
              className="w-full pl-12 pr-4 py-4 rounded-2xl bg-dark-800 border border-dark-600 text-white placeholder-dark-400 focus:outline-none focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 transition-all"
            />
          </div>
        </div>
      </section>

      {/* Quick Links */}
      <section className="py-8 px-4 border-b border-dark-800">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { icon: BookOpen, label: 'Getting Started', href: '#getting-started' },
              { icon: Users, label: 'Groups', href: '#groups' },
              { icon: Receipt, label: 'Expenses', href: '#expenses' },
              { icon: Mail, label: 'Contact Support', href: 'mailto:customersupport@splitelite.com' }
            ].map((link, i) => (
              <a
                key={i}
                href={link.href}
                className="flex items-center gap-3 p-4 rounded-xl bg-dark-800/50 hover:bg-dark-800 border border-dark-700 hover:border-primary-500/50 transition-all group"
              >
                <div className="p-2 rounded-lg bg-primary-500/20 group-hover:bg-primary-500/30 transition-colors">
                  <link.icon className="w-5 h-5 text-primary-400" />
                </div>
                <span className="text-white font-medium">{link.label}</span>
              </a>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ Content */}
      <main className="max-w-6xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Category Navigation */}
          <nav className="lg:col-span-1">
            <div className="sticky top-24 space-y-2">
              <h3 className="text-sm font-semibold text-dark-400 uppercase tracking-wider mb-4">
                Categories
              </h3>
              {faqCategories.map((category) => (
                <button
                  key={category.id}
                  onClick={() => {
                    setExpandedCategory(category.id);
                    document.getElementById(category.id)?.scrollIntoView({ behavior: 'smooth' });
                  }}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
                    expandedCategory === category.id
                      ? 'bg-primary-500/20 text-primary-400'
                      : 'text-dark-300 hover:bg-dark-800 hover:text-white'
                  }`}
                >
                  <category.icon className="w-5 h-5" />
                  <span className="font-medium">{category.title}</span>
                </button>
              ))}
            </div>
          </nav>

          {/* FAQ Items */}
          <div className="lg:col-span-3 space-y-8">
            {filteredCategories.length === 0 ? (
              <div className="text-center py-12">
                <HelpCircle className="w-16 h-16 mx-auto text-dark-600 mb-4" />
                <p className="text-dark-400 text-lg">No results found for "{searchQuery}"</p>
                <p className="text-dark-500 mt-2">Try different keywords or browse categories</p>
              </div>
            ) : (
              filteredCategories.map((category) => (
                <section key={category.id} id={category.id} className="scroll-mt-24">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="p-2 rounded-xl bg-primary-500/20">
                      <category.icon className="w-5 h-5 text-primary-400" />
                    </div>
                    <h2 className="text-xl font-bold text-white">{category.title}</h2>
                  </div>
                  
                  <div className="space-y-3">
                    {category.items.map((item, index) => {
                      const isExpanded = expandedQuestions.has(`${category.id}-${index}`);
                      return (
                        <div
                          key={index}
                          className="rounded-xl bg-dark-800/50 border border-dark-700 overflow-hidden"
                        >
                          <button
                            onClick={() => toggleQuestion(category.id, index)}
                            className="w-full flex items-center justify-between p-4 text-left hover:bg-dark-800/50 transition-colors"
                          >
                            <span className="font-medium text-white pr-4">{item.question}</span>
                            {isExpanded ? (
                              <ChevronDown className="w-5 h-5 text-primary-400 flex-shrink-0" />
                            ) : (
                              <ChevronRight className="w-5 h-5 text-dark-400 flex-shrink-0" />
                            )}
                          </button>
                          {isExpanded && (
                            <div className="px-4 pb-4">
                              <p className="text-dark-300 leading-relaxed">{item.answer}</p>
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </section>
              ))
            )}
          </div>
        </div>
      </main>

      {/* Contact Section */}
      <section className="bg-dark-900/50 border-t border-dark-700 py-12 px-4">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-2xl font-bold text-white mb-4">Still need help?</h2>
          <p className="text-dark-400 mb-6">
            Can't find what you're looking for? Our support team is here to help.
          </p>
          <a
            href="mailto:customersupport@splitelite.com"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-primary-500 hover:bg-primary-600 text-white font-semibold transition-colors"
          >
            <Mail className="w-5 h-5" />
            Contact Support
          </a>
          <p className="text-dark-500 text-sm mt-4">
            customersupport@splitelite.com • We typically respond within 24 hours
          </p>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-dark-700 py-6 px-4">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4 text-sm text-dark-400">
          <p>© {new Date().getFullYear()} SplitElite. All rights reserved.</p>
          <div className="flex gap-6">
            <Link href="/privacy" className="hover:text-white transition-colors">Privacy Policy</Link>
            <Link href="/terms" className="hover:text-white transition-colors">Terms of Service</Link>
            <Link href="/help" className="hover:text-white transition-colors">Help Center</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
