import { useState, useEffect, useRef } from 'react';
import { Plus, Trash2, HelpCircle, AlertCircle, X, Save } from 'lucide-react';

export default function AdminFaqs() {
  const [faqs, setFaqs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [deleteModal, setDeleteModal] = useState({ show: false, faqId: null, question: '' });
  const [addModal, setAddModal] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const [newFaq, setNewFaq] = useState({
    question: '',
    response: ''
  });

  // Refs for modal click outside detection
  const addModalRef = useRef(null);
  const deleteModalRef = useRef(null);

  useEffect(() => {
    fetchFaqs();
  }, []);

  const fetchFaqs = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/faqs/get');
      if (!response.ok) throw new Error('Failed to fetch FAQs');
      const data = await response.json();
      setFaqs(data);
      setError(null);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Close modal when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (addModal && addModalRef.current && !addModalRef.current.contains(event.target)) {
        setAddModal(false);
      }
      if (deleteModal.show && deleteModalRef.current && !deleteModalRef.current.contains(event.target)) {
        setDeleteModal({ show: false, faqId: null, question: '' });
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [addModal, deleteModal]);

  const handleDelete = async () => {
    try {
      setDeleting(true);
      const response = await fetch('/api/faqs/delete', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: deleteModal.faqId }),
      });

      if (!response.ok) throw new Error('Failed to delete FAQ');

      await fetchFaqs();
      setDeleteModal({ show: false, faqId: null, question: '' });
    } catch (err) {
      alert('Error deleting FAQ: ' + err.message);
    } finally {
      setDeleting(false);
    }
  };

  const handleAddFaq = async (e) => {
    e.preventDefault();

    if (!newFaq.question.trim() || !newFaq.response.trim()) {
      alert('Both question and response are required');
      return;
    }

    try {
      setSubmitting(true);
      const response = await fetch('/api/faqs/add', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newFaq),
      });

      if (!response.ok) throw new Error('Failed to add FAQ');

      await fetchFaqs();
      setAddModal(false);
      setNewFaq({ question: '', response: '' });
    } catch (err) {
      alert('Error adding FAQ: ' + err.message);
    } finally {
      setSubmitting(false);
    }
  };

  const resetAddModal = () => {
    setAddModal(false);
    setNewFaq({ question: '', response: '' });
  };

  return (
    <div className="min-h-screen bg-stone-50 relative overflow-hidden md:mr-16">
      {/* Background Elements */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden opacity-40">
        <div className="absolute -top-40 -right-40 w-96 h-96 bg-gradient-radial from-amber-200/60 via-amber-100/30 to-transparent rounded-full blur-3xl animate-float" />
        <div className="absolute top-1/3 -left-32 w-80 h-80 bg-gradient-radial from-stone-300/50 via-stone-200/20 to-transparent rounded-full blur-3xl animate-float-delayed" />
        <div className="absolute bottom-20 right-1/4 w-64 h-64 bg-gradient-radial from-amber-300/40 via-transparent to-transparent rounded-full blur-3xl animate-float-slow" />
      </div>

      {/* Header Section */}
      <section className="relative pt-28 pb-16 px-8 lg:px-16">
        <div className="max-w-[1600px] mx-auto">
          <div className="flex flex-col md:flex-row gap-2 items-center justify-between mb-12">
            <div className="space-y-2 text-center sm:text-left">
              <div className="text-xs tracking-[0.4em] uppercase text-amber-900 font-semibold">
                Administration
              </div>
              <div className="w-12 h-px bg-amber-900 mx-auto sm:mx-0" />
              <h1 className="text-3xl sm:text-4xl md:text-5xl font-serif font-bold text-stone-900 leading-tight">
                FAQs
                <br />
                <span className="italic text-amber-900">Management</span>
              </h1>
            </div>

            <button
              onClick={() => setAddModal(true)}
              className="group relative px-6 py-3 sm:px-8 sm:py-4 overflow-hidden rounded font-medium tracking-wider uppercase text-sm sm:text-base"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-amber-600 to-amber-800" />
              <div className="absolute inset-0 bg-gradient-to-r from-amber-700 to-amber-900 translate-y-full group-hover:translate-y-0 transition-transform duration-500" />
              <span className="relative z-10 text-white flex items-center justify-center space-x-2 sm:space-x-3">
                <Plus className="w-4 h-4 sm:w-5 sm:h-5" />
                <span>Add New FAQ</span>
              </span>
            </button>
          </div>

          {/* Stats Card */}
          <div className="bg-white/80 backdrop-blur-sm rounded-xl sm:rounded-2xl p-4 sm:p-6 border border-stone-200/50 shadow-lg max-w-xs mx-auto sm:mx-0">
            <div className="text-xs sm:text-sm font-semibold text-stone-600 uppercase tracking-wider mb-1 sm:mb-2">
              Total FAQs
            </div>
            <div className="text-2xl sm:text-4xl font-serif font-bold text-amber-900">
              {faqs.length}
            </div>
          </div>
        </div>
      </section>

      {/* FAQs List */}
      <section className="relative pb-24 px-4 sm:px-8 lg:px-16">
        <div className="max-w-[1600px] mx-auto">
          {loading ? (
            <div className="flex items-center justify-center py-16">
              <div className="text-center space-y-3">
                <div className="w-12 h-12 sm:w-16 sm:h-16 border-4 border-amber-900/20 border-t-amber-900 rounded-full animate-spin mx-auto" />
                <p className="text-stone-600 font-light text-sm sm:text-base">Loading FAQs...</p>
              </div>
            </div>
          ) : error ? (
            <div className="bg-rose-50 border-2 border-rose-200 rounded-xl sm:rounded-2xl p-6 sm:p-8 text-center">
              <AlertCircle className="w-8 h-8 sm:w-12 sm:h-12 text-rose-600 mx-auto mb-3" />
              <p className="text-rose-900 text-base sm:text-lg font-medium">{error}</p>
            </div>
          ) : faqs.length === 0 ? (
            <div className="bg-white/80 backdrop-blur-sm border-2 border-stone-200 rounded-xl sm:rounded-2xl p-8 sm:p-12 text-center">
              <HelpCircle className="w-12 h-12 sm:w-16 sm:h-16 text-stone-400 mx-auto mb-3" />
              <p className="text-stone-600 text-base sm:text-lg font-light">No FAQs found</p>
            </div>
          ) : (
            <div className="space-y-3 sm:space-y-4">
              {faqs.map((faq, index) => (
                <div
                  key={faq.id}
                  className="group bg-white/95 backdrop-blur-xl rounded-xl sm:rounded-2xl shadow-lg border border-stone-200/50 hover:shadow-xl sm:hover:shadow-2xl transition-all duration-300 overflow-hidden"
                >
                  <div className="p-4 sm:p-6">
                    <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
                      {/* FAQ Number & Content */}
                      <div className="flex-1 space-y-3 sm:space-y-4">
                        {/* Number Badge */}
                        <div className="inline-flex items-center justify-center w-8 h-8 sm:w-10 sm:h-10 bg-amber-100 text-amber-900 rounded-full font-serif font-bold text-xs sm:text-sm">
                          {index + 1}
                        </div>

                        {/* Question */}
                        <div>
                          <div className="flex items-start space-x-2 sm:space-x-3 mb-2 sm:mb-3">
                            <HelpCircle className="w-4 h-4 sm:w-5 sm:h-5 text-amber-900 flex-shrink-0 mt-0.5" />
                            <h3 className="text-lg sm:text-xl font-serif font-bold text-stone-900 leading-tight">
                              {faq.question}
                            </h3>
                          </div>

                          {/* Response */}
                          <div className="ml-6 sm:ml-9 pl-4 sm:pl-6 border-l-2 border-amber-900/20">
                            <p className="text-stone-600 leading-relaxed font-light text-sm sm:text-base">
                              {faq.response}
                            </p>
                          </div>
                        </div>

                        {/* Meta Info */}
                        <div className="ml-6 sm:ml-9 text-xs text-stone-500 uppercase tracking-wider">
                          FAQ ID: #{faq.id}
                        </div>
                      </div>

                      {/* Delete Button */}
                      <div className="flex sm:block justify-end sm:justify-start">
                        <button
                          onClick={() => setDeleteModal({ show: true, faqId: faq.id, question: faq.question })}
                          className="flex-shrink-0 p-2 sm:p-3 bg-white border-2 border-rose-600 text-rose-600 rounded-lg hover:bg-rose-600 hover:text-white transition-all duration-300 group/btn text-xs sm:text-base"
                        >
                          <Trash2 className="w-4 h-4 sm:w-5 sm:h-5" />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Add FAQ Modal */}
      {addModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-stone-900/80 backdrop-blur-sm animate-fade-in">
          <div
            ref={addModalRef}
            className="bg-white rounded-xl sm:rounded-2xl w-full max-w-md sm:max-w-2xl shadow-2xl border border-stone-200 overflow-hidden animate-scale-in max-h-[90vh] flex flex-col"
          >
            {/* Modal Header */}
            <div className="bg-gradient-to-r from-amber-600 to-amber-800 px-4 sm:px-8 py-4 sm:py-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2 sm:space-x-3">
                  <div className="w-8 h-8 sm:w-12 sm:h-12 bg-white/20 rounded-full flex items-center justify-center">
                    <Plus className="w-4 h-4 sm:w-6 sm:h-6 text-white" />
                  </div>
                  <h3 className="text-lg sm:text-2xl font-serif font-bold text-white">Add New FAQ</h3>
                </div>
                <button
                  onClick={resetAddModal}
                  className="text-white/80 hover:text-white transition-colors"
                  disabled={submitting}
                >
                  <X className="w-5 h-5 sm:w-6 sm:h-6" />
                </button>
              </div>
            </div>

            {/* Modal Body */}
            <form onSubmit={handleAddFaq} className="p-4 sm:p-8 space-y-4 sm:space-y-6 overflow-y-auto flex-1">
              {/* Question */}
              <div>
                <label className="block text-xs sm:text-sm font-semibold text-stone-700 uppercase tracking-wider mb-2">
                  Question *
                </label>
                <textarea
                  value={newFaq.question}
                  onChange={(e) => setNewFaq({ ...newFaq, question: e.target.value })}
                  rows="3"
                  className="w-full px-3 sm:px-6 py-3 bg-stone-50 border-2 border-stone-200 rounded-lg focus:border-amber-900 focus:outline-none transition-colors text-stone-900 font-light resize-none text-sm sm:text-base"
                  placeholder="Enter the question..."
                  required
                  disabled={submitting}
                />
              </div>

              {/* Response */}
              <div>
                <label className="block text-xs sm:text-sm font-semibold text-stone-700 uppercase tracking-wider mb-2">
                  Response *
                </label>
                <textarea
                  value={newFaq.response}
                  onChange={(e) => setNewFaq({ ...newFaq, response: e.target.value })}
                  rows="5"
                  className="w-full px-3 sm:px-6 py-3 bg-stone-50 border-2 border-stone-200 rounded-lg focus:border-amber-900 focus:outline-none transition-colors text-stone-900 font-light resize-none text-sm sm:text-base"
                  placeholder="Enter the response..."
                  required
                  disabled={submitting}
                />
              </div>

              {/* Buttons */}
              <div className="flex space-x-2 sm:space-x-4 pt-2">
                <button
                  type="button"
                  onClick={resetAddModal}
                  disabled={submitting}
                  className="flex-1 px-4 sm:px-6 py-3 border-2 border-stone-300 text-stone-700 rounded-lg font-medium tracking-wider uppercase text-xs sm:text-sm hover:bg-stone-100 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="flex-1 px-4 sm:px-6 py-3 bg-gradient-to-r from-amber-600 to-amber-800 text-white rounded-lg font-medium tracking-wider uppercase text-xs sm:text-sm hover:from-amber-700 hover:to-amber-900 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-1 sm:space-x-2"
                >
                  {submitting ? (
                    <>
                      <div className="w-4 h-4 sm:w-5 sm:h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      <span>Adding...</span>
                    </>
                  ) : (
                    <>
                      <Save className="w-4 h-4 sm:w-5 sm:h-5" />
                      <span>Add FAQ</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deleteModal.show && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-stone-900/80 backdrop-blur-sm animate-fade-in">
          <div
            ref={deleteModalRef}
            className="bg-white rounded-xl sm:rounded-2xl w-full max-w-xs sm:max-w-md shadow-2xl border border-stone-200 overflow-hidden animate-scale-in"
          >
            {/* Modal Header */}
            <div className="bg-gradient-to-r from-rose-600 to-rose-800 px-4 sm:px-8 py-4 sm:py-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2 sm:space-x-3">
                  <div className="w-8 h-8 sm:w-12 sm:h-12 bg-white/20 rounded-full flex items-center justify-center">
                    <AlertCircle className="w-4 h-4 sm:w-6 sm:h-6 text-white" />
                  </div>
                  <h3 className="text-lg sm:text-2xl font-serif font-bold text-white">Confirm Delete</h3>
                </div>
                <button
                  onClick={() => setDeleteModal({ show: false, faqId: null, question: '' })}
                  className="text-white/80 hover:text-white transition-colors"
                  disabled={deleting}
                >
                  <X className="w-5 h-5 sm:w-6 sm:h-6" />
                </button>
              </div>
            </div>

            {/* Modal Body */}
            <div className="p-4 sm:p-8 space-y-4 sm:space-y-6">
              <p className="text-stone-600 leading-relaxed text-sm sm:text-base">
                Are you sure you want to delete this FAQ: <span className="font-semibold text-stone-900">"{deleteModal.question}"</span>? This action cannot be undone.
              </p>

              <div className="flex space-x-2 sm:space-x-4">
                <button
                  onClick={() => setDeleteModal({ show: false, faqId: null, question: '' })}
                  disabled={deleting}
                  className="flex-1 px-4 sm:px-6 py-3 border-2 border-stone-300 text-stone-700 rounded-lg font-medium tracking-wider uppercase text-xs sm:text-sm hover:bg-stone-100 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Cancel
                </button>
                <button
                  onClick={handleDelete}
                  disabled={deleting}
                  className="flex-1 px-4 sm:px-6 py-3 bg-gradient-to-r from-rose-600 to-rose-800 text-white rounded-lg font-medium tracking-wider uppercase text-xs sm:text-sm hover:from-rose-700 hover:to-rose-900 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-1 sm:space-x-2"
                >
                  {deleting ? (
                    <>
                      <div className="w-4 h-4 sm:w-5 sm:h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      <span>Deleting...</span>
                    </>
                  ) : (
                    <>
                      <Trash2 className="w-4 h-4 sm:w-5 sm:h-5" />
                      <span>Delete</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}