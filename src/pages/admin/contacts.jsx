import { useEffect, useState } from 'react';
import { Mail, User, AlertCircle, MessageCircle } from 'lucide-react';
import { verifyAuth } from '@/middlewares/rootAuth';

export default function AdminContacts() {
  const [contacts, setContacts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchContacts();
  }, []);

  const fetchContacts = async () => {
    try {
      setLoading(true);
      const res = await fetch('/api/contacts/getAll');
      if (!res.ok) throw new Error('Failed to fetch contacts');
      const data = await res.json();
      setContacts(data);
      setError(null);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-stone-50 relative overflow-hidden md:mr-16">
      {/* Header */}
      <section className="relative pt-28 pb-16 px-8 lg:px-16">
        <div className="max-w-[1600px] mx-auto">
          <div className="space-y-2">
            <div className="text-xs tracking-[0.4em] uppercase text-amber-900 font-semibold">
              Administration
            </div>
            <div className="w-12 h-px bg-amber-900" />
            <h1 className="text-4xl md:text-5xl font-serif font-bold text-stone-900">
              Contacts
              <br />
              <span className="italic text-amber-900">Messages</span>
            </h1>
          </div>

          <div className="mt-8 bg-white/80 backdrop-blur-sm rounded-2xl p-6 border border-stone-200 shadow-lg max-w-xs">
            <div className="text-sm text-stone-600 uppercase tracking-wider">
              Total Messages
            </div>
            <div className="text-4xl font-serif font-bold text-amber-900">
              {contacts.length}
            </div>
          </div>
        </div>
      </section>

      {/* Content */}
      <section className="relative pb-24 px-4 sm:px-8 lg:px-16">
        <div className="max-w-[1600px] mx-auto">
          {loading ? (
            <div className="flex justify-center py-16">
              <div className="w-16 h-16 border-4 border-amber-900/20 border-t-amber-900 rounded-full animate-spin" />
            </div>
          ) : error ? (
            <div className="bg-rose-50 border-2 border-rose-200 rounded-2xl p-8 text-center">
              <AlertCircle className="w-12 h-12 text-rose-600 mx-auto mb-4" />
              <p className="text-rose-900 text-lg">{error}</p>
            </div>
          ) : contacts.length === 0 ? (
            <div className="bg-white border-2 border-stone-200 rounded-2xl p-12 text-center">
              <MessageCircle className="w-16 h-16 text-stone-400 mx-auto mb-4" />
              <p className="text-stone-600 text-lg">No contacts found</p>
            </div>
          ) : (
            <div className="space-y-4">
              {contacts.map((contact, index) => (
                <div
                  key={contact.id}
                  className="bg-white/95 backdrop-blur-xl rounded-2xl shadow-lg border border-stone-200 hover:shadow-2xl transition-all duration-300 p-6"
                >
                  <div className="flex items-start justify-between gap-6">
                    <div className="flex-1 space-y-4">
                      {/* Header */}
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 bg-amber-100 text-amber-900 rounded-full flex items-center justify-center font-bold">
                          {index + 1}
                        </div>
                        <h3 className="text-xl font-serif font-bold text-stone-900">
                          {contact.subject || 'No subject'}
                        </h3>
                      </div>

                      {/* Meta */}
                      <div className="flex flex-wrap gap-6 text-sm text-stone-600">
                        <div className="flex items-center gap-2">
                          <User className="w-4 h-4 text-amber-900" />
                          {contact.name}
                        </div>
                        {contact.email && (
                          <div className="flex items-center gap-2">
                            <Mail className="w-4 h-4 text-amber-900" />
                            {contact.email}
                          </div>
                        )}
                      </div>

                      {/* Message */}
                      <div className="pl-6 border-l-2 border-amber-900/20">
                        <p className="text-stone-600 leading-relaxed font-light">
                          {contact.message}
                        </p>
                      </div>

                      <div className="text-xs text-stone-500 uppercase tracking-wider">
                        Contact ID: #{contact.id}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  );
}

export async function getServerSideProps({ req, res }) {
  const root = verifyAuth(req, res);

  if (!root) {
    return {
      redirect: {
        destination: "/admin/login",
        permanent: false,
      },
    };
  }

  return {
    props: { session: { connected: true } },
  };
}