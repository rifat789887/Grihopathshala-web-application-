import { useState, useEffect } from 'react';
import { collection, getDocs, query, orderBy, limit } from 'firebase/firestore';
import { db } from '../firebase';
import { motion } from 'motion/react';
import { BookOpen, Calendar, User as UserIcon, ArrowRight, Share2, Heart } from 'lucide-react';
import { format } from 'date-fns';
import { Helmet } from 'react-helmet-async';

export default function Blog() {
  const [posts, setPosts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPosts = async () => {
      // Reusing notices for blog for now, or could have a separate collection
      const q = query(collection(db, 'notices'), orderBy('date', 'desc'), limit(6));
      const snap = await getDocs(q);
      setPosts(snap.docs.map(d => ({ id: d.id, ...d.data() })));
      setLoading(false);
    };
    fetchPosts();
  }, []);

  return (
    <div className="space-y-16">
      <Helmet>
        <title>নিউজ ও ব্লগ | গৃহপাঠশালা - আপনার অনলাইন শিক্ষা সঙ্গী | News & Blog - GrihoPathshala</title>
        <meta name="description" content="গৃহপাঠশালার সর্বশেষ নিউজ এবং ব্লগ পোস্টগুলো পড়ুন। শিক্ষামূলক বিভিন্ন টিপস এবং ট্রিকস এখান থেকে জেনে নিন। Read the latest news and educational tips from GrihoPathshala." />
        <script type="application/ld+json">
          {`
            {
              "@context": "https://schema.org",
              "@type": "BreadcrumbList",
              "itemListElement": [{
                "@type": "ListItem",
                "position": 1,
                "name": "Home",
                "item": "https://ais-pre-v3v74nro3bue67z6xfn4sr-51425668115.asia-east1.run.app/"
              },{
                "@type": "ListItem",
                "position": 2,
                "name": "Blog",
                "item": "https://ais-pre-v3v74nro3bue67z6xfn4sr-51425668115.asia-east1.run.app/blog"
              }]
            }
          `}
        </script>
        {posts.length > 0 && (
          <script type="application/ld+json">
            {`
              {
                "@context": "https://schema.org",
                "@type": "ItemList",
                "itemListElement": ${JSON.stringify(posts.map((p, i) => ({
                  "@type": "ListItem",
                  "position": i + 1,
                  "item": {
                    "@type": "BlogPosting",
                    "headline": p.title,
                    "description": p.content?.substring(0, 160),
                    "datePublished": p.date,
                    "author": {
                      "@type": "Person",
                      "name": "Admin"
                    },
                    "publisher": {
                      "@type": "Organization",
                      "name": "GrihoPathshala",
                      "logo": {
                        "@type": "ImageObject",
                        "url": "https://ais-pre-v3v74nro3bue67z6xfn4sr-51425668115.asia-east1.run.app/graduation-cap.svg"
                      }
                    }
                  }
                })))}
              }
            `}
          </script>
        )}
      </Helmet>
      <div className="text-center space-y-6">
        <h1 className="text-5xl font-black text-white tracking-tight flex items-center justify-center gap-6">
          <BookOpen className="text-emerald-500 animate-bounce" size={56} /> নিউজ ও ব্লগ
        </h1>
        <p className="text-slate-400 max-w-2xl mx-auto text-lg font-medium">গৃহপাঠশালা টিমের পক্ষ থেকে সর্বশেষ শিক্ষামূলক অন্তর্দৃষ্টি, টিপস এবং আপডেট।</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
        {posts.map((post, i) => (
          <motion.article
            key={post.id}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.1 }}
            className="group bg-slate-900/50 border border-white/10 rounded-[3rem] overflow-hidden hover:border-emerald-500/30 transition-all flex flex-col shadow-2xl hover:shadow-emerald-500/5"
          >
            <div className="aspect-[16/10] relative overflow-hidden">
              <img src={`https://picsum.photos/seed/${post.id}/600/400`} alt={post.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" referrerPolicy="no-referrer" loading="lazy" />
              <div className="absolute top-6 left-6">
                <span className="px-5 py-2.5 bg-emerald-500 text-slate-950 rounded-2xl text-[11px] font-black uppercase tracking-widest shadow-2xl">
                  শিক্ষা
                </span>
              </div>
            </div>
            <div className="p-10 flex-1 flex flex-col space-y-6">
              <div className="flex items-center gap-6 text-xs text-slate-500 font-black uppercase tracking-widest">
                <div className="flex items-center gap-2 bg-white/5 px-3 py-1.5 rounded-lg border border-white/5"><Calendar size={14} className="text-emerald-500" /> {format(new Date(post.date), 'MMM dd, yyyy')}</div>
                <div className="flex items-center gap-2 bg-white/5 px-3 py-1.5 rounded-lg border border-white/5"><UserIcon size={14} className="text-emerald-500" /> এডমিন</div>
              </div>
              <h2 className="text-2xl font-black text-white group-hover:text-emerald-500 transition-colors line-clamp-2 leading-tight">
                {post.title}
              </h2>
              <p className="text-slate-400 text-base leading-relaxed line-clamp-3 font-medium">
                {post.content}
              </p>
              <div className="pt-8 mt-auto border-t border-white/5 flex items-center justify-between">
                <button className="text-emerald-500 font-black text-sm hover:underline flex items-center gap-3 group/btn transition-all">
                  আরও পড়ুন <ArrowRight size={18} className="group-hover/btn:translate-x-2 transition-transform" />
                </button>
                <div className="flex items-center gap-5 text-slate-600">
                  <button className="hover:text-emerald-500 transition-all hover:scale-125"><Heart size={20} /></button>
                  <button className="hover:text-emerald-500 transition-all hover:scale-125"><Share2 size={20} /></button>
                </div>
              </div>
            </div>
          </motion.article>
        ))}
        {posts.length === 0 && !loading && (
          <div className="col-span-full p-24 text-center bg-slate-900/50 border border-dashed border-white/10 rounded-[3rem] text-slate-500 italic text-xl font-medium">
            এখনও কোনো ব্লগ পোস্ট উপলব্ধ নেই।
          </div>
        )}
      </div>
    </div>
  );
}
