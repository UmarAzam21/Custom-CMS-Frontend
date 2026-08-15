// import { useState } from "react";

// const NAV_ITEMS = [
//   { key: "inbox", label: "Inbox", icon: "inbox", count: 5 },
//   { key: "unread", label: "Unread", icon: "mail", count: 3 },
//   { key: "replied", label: "Replied", icon: "reply", count: 2 },
//   { key: "starred", label: "Starred", icon: "star", count: 2 },
//   { key: "archived", label: "Archived", icon: "archive", count: 0 },
//   { key: "trash", label: "Trash", icon: "trash", count: 1 },
// ];

// const MESSAGES = [
//   {
//     id: 1,
//     initials: "SM",
//     color: "#c8102e",
//     name: "Sarah Mitchell",
//     subject: "Project Inquiry — Website Redesign",
//     preview: "Hi there, I'm interested in getting a quote for a co...",
//     date: "10:32 AM",
//     tag: "NEW",
//     starred: true,
//     unread: true,
//     replied: false,
//   },
//   {
//     id: 2,
//     initials: "JT",
//     color: "#1f2937",
//     name: "James Thornton",
//     subject: "SEO Consultation Request",
//     preview: "We've been struggling with our organic traf...",
//     date: "Yesterday",
//     tag: "REPLIED",
//     starred: false,
//     unread: false,
//     replied: true,
//   },
//   {
//     id: 3,
//     initials: "PS",
//     color: "#c8102e",
//     name: "Priya Sharma",
//     subject: "Logo Design Package Inquiry",
//     preview: "Hello! I'm launching a new bakery brand and...",
//     date: "Jul 26",
//     tag: "NEW",
//     starred: false,
//     unread: true,
//     replied: false,
//   },
//   {
//     id: 4,
//     initials: "MW",
//     color: "#c8102e",
//     name: "Marcus Webb",
//     subject: "Follow-up: E-commerce Development",
//     preview: "Just following up on our conversation last w...",
//     date: "Jul 25",
//     tag: "REPLIED",
//     starred: true,
//     unread: false,
//     replied: true,
//   },
//   {
//     id: 5,
//     initials: "EC",
//     color: "#c8102e",
//     name: "Emma Chen",
//     subject: "Marketing Landing Page",
//     preview: "We're launching a product in 6 weeks and u...",
//     date: "Jul 24",
//     tag: "NEW",
//     starred: false,
//     unread: true,
//     replied: false,
//   },
// ];

// const ICONS = {
//   inbox: (
//     <path strokeLinecap="round" strokeLinejoin="round" d="M3 8.25V6a2.25 2.25 0 0 1 2.25-2.25h13.5A2.25 2.25 0 0 1 21 6v2.25m-18 0v9.75A2.25 2.25 0 0 0 5.25 20.25h13.5A2.25 2.25 0 0 0 21 18V8.25m-18 0h5.379a1.5 1.5 0 0 1 1.06.44l.622.62a1.5 1.5 0 0 0 1.06.44h3.758a1.5 1.5 0 0 0 1.06-.44l.622-.62a1.5 1.5 0 0 1 1.06-.44H21" />
//   ),
//   mail: (
//     <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 0 1-2.25 2.25h-15a2.25 2.25 0 0 1-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0 0 19.5 4.5h-15a2.25 2.25 0 0 0-2.25 2.25m19.5 0v.243a2.25 2.25 0 0 1-1.07 1.916l-7.5 4.615a2.25 2.25 0 0 1-2.36 0L3.32 8.91a2.25 2.25 0 0 1-1.07-1.916V6.75" />
//   ),
//   reply: (
//     <path strokeLinecap="round" strokeLinejoin="round" d="M9 15 3 9m0 0 6-6M3 9h12a6 6 0 0 1 6 6v3" />
//   ),
//   star: (
//     <path strokeLinecap="round" strokeLinejoin="round" d="m11.48 3.499 2.031 4.116a.562.562 0 0 0 .424.308l4.54.66c.46.067.643.632.31.955l-3.286 3.203a.563.563 0 0 0-.162.498l.776 4.522c.078.457-.402.806-.813.59l-4.06-2.135a.563.563 0 0 0-.524 0l-4.06 2.135c-.41.216-.89-.133-.813-.59l.776-4.522a.562.562 0 0 0-.162-.498l-3.286-3.203c-.334-.323-.15-.888.31-.955l4.54-.66a.563.563 0 0 0 .424-.308l2.031-4.116c.206-.417.79-.417.996 0Z" />
//   ),
//   archive: (
//     <path strokeLinecap="round" strokeLinejoin="round" d="M20.25 7.5l-.625 10.632a2.25 2.25 0 0 1-2.247 2.118H6.622a2.25 2.25 0 0 1-2.247-2.118L3.75 7.5M10 11.25h4M3.375 7.5h17.25c.621 0 1.125-.504 1.125-1.125v-1.5c0-.621-.504-1.125-1.125-1.125H3.375C2.754 3.75 2.25 4.254 2.25 4.875v1.5c0 .621.504 1.125 1.125 1.125Z" />
//   ),
//   trash: (
//     <path strokeLinecap="round" strokeLinejoin="round" d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0" />
//   ),
// };

// function Icon({ name, className }) {
//   return (
//     <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className={className}>
//       {ICONS[name]}
//     </svg>
//   );
// }

// export default function MessagesSidebar() {
//   const [activeNav, setActiveNav] = useState("inbox");
//   const [selectedId, setSelectedId] = useState(1);
//   const [query, setQuery] = useState("");

//   const filtered = MESSAGES.filter((m) => {
//     if (activeNav === "unread" && !m.unread) return false;
//     if (activeNav === "replied" && !m.replied) return false;
//     if (activeNav === "starred" && !m.starred) return false;
//     if (activeNav === "trash" || activeNav === "archived") return false;
//     if (query && !`${m.name} ${m.subject}`.toLowerCase().includes(query.toLowerCase())) return false;
//     return true;
//   });

//   return (
//     <div className="flex h-screen bg-white text-[#111111]">
//       {/* Nav column */}
//       <div className="flex w-48 shrink-0 flex-col border-r border-slate-200 bg-white p-3">
//         <div className="mb-3 px-2 text-[11px] font-bold tracking-wide text-slate-400">
//           MESSAGES
//         </div>
//         <nav className="space-y-1">
//           {NAV_ITEMS.map((item) => {
//             const isActive = activeNav === item.key;
//             return (
//               <button
//                 key={item.key}
//                 onClick={() => setActiveNav(item.key)}
//                 className={`flex w-full items-center justify-between rounded-lg px-2.5 py-2 text-[12px] font-semibold transition-all duration-150 ${
//                   isActive
//                     ? "bg-[#FEF2F2] text-[#c8102e]"
//                     : "text-[#374151] hover:bg-slate-50"
//                 }`}
//               >
//                 <span className="flex items-center gap-2">
//                   <Icon name={item.icon} className="h-4 w-4" />
//                   {item.label}
//                 </span>
//                 {item.count > 0 && (
//                   <span
//                     className={`rounded-full px-1.5 py-0.5 text-[10px] font-bold transition-colors duration-150 ${
//                       isActive ? "bg-[#c8102e] text-white" : "bg-slate-100 text-slate-500"
//                     }`}
//                   >
//                     {item.count}
//                   </span>
//                 )}
//               </button>
//             );
//           })}
//         </nav>
//       </div>

//       {/* Message list column */}
//       <div className="flex w-80 shrink-0 flex-col border-r border-slate-200 bg-white">
//         <div className="border-b border-slate-200 p-3">
//           <div className="relative">
//             <Icon
//               name="mail"
//               className="pointer-events-none absolute left-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-slate-400"
//             />
//             <input
//               value={query}
//               onChange={(e) => setQuery(e.target.value)}
//               placeholder="Search messages..."
//               className="w-full rounded-lg border border-slate-200 py-2 pl-8 pr-3 text-[12px] outline-none transition-all duration-150 focus:border-[#c8102e] focus:ring-2 focus:ring-[#c8102e]/20 hover:border-slate-300"
//             />
//           </div>
//         </div>

//         <div className="flex-1 overflow-y-auto">
//           {filtered.length === 0 && (
//             <div className="p-6 text-center text-[12px] text-slate-400">No messages here.</div>
//           )}
//           {filtered.map((m) => {
//             const isSelected = selectedId === m.id;
//             return (
//               <button
//                 key={m.id}
//                 onClick={() => setSelectedId(m.id)}
//                 className={`relative flex w-full flex-col items-start gap-1 border-b border-slate-100 px-3 py-3 text-left transition-all duration-150 ${
//                   isSelected ? "bg-[#FEF2F2]" : "hover:bg-slate-50"
//                 }`}
//               >
//                 {isSelected && (
//                   <span className="absolute left-0 top-0 h-full w-0.5 bg-[#c8102e]" />
//                 )}
//                 <div className="flex w-full items-start gap-2.5">
//                   <div
//                     className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-[11px] font-bold text-white"
//                     style={{ backgroundColor: m.color }}
//                   >
//                     {m.initials}
//                   </div>
//                   <div className="min-w-0 flex-1">
//                     <div className="flex items-center justify-between gap-2">
//                       <span className="truncate text-[12px] font-bold text-[#111827]">
//                         {m.name}
//                       </span>
//                       <span className="shrink-0 text-[10px] text-slate-400">{m.date}</span>
//                     </div>
//                     <div className="truncate text-[12px] font-semibold text-[#374151]">
//                       {m.subject}
//                     </div>
//                     <div className="truncate text-[11px] text-slate-500">{m.preview}</div>
//                     <div className="mt-1 flex items-center gap-1.5">
//                       {m.tag && (
//                         <span
//                           className={`rounded-full px-1.5 py-0.5 text-[9px] font-bold ${
//                             m.tag === "NEW"
//                               ? "bg-[#FEF2F2] text-[#c8102e]"
//                               : "bg-emerald-50 text-emerald-600"
//                           }`}
//                         >
//                           {m.tag}
//                         </span>
//                       )}
//                       {m.starred && (
//                         <svg viewBox="0 0 24 24" fill="#f59e0b" className="h-3 w-3">
//                           <path d="m11.48 3.499 2.031 4.116a.562.562 0 0 0 .424.308l4.54.66c.46.067.643.632.31.955l-3.286 3.203a.563.563 0 0 0-.162.498l.776 4.522c.078.457-.402.806-.813.59l-4.06-2.135a.563.563 0 0 0-.524 0l-4.06 2.135c-.41.216-.89-.133-.813-.59l.776-4.522a.562.562 0 0 0-.162-.498l-3.286-3.203c-.334-.323-.15-.888.31-.955l4.54-.66a.563.563 0 0 0 .424-.308l2.031-4.116c.206-.417.79-.417.996 0Z" />
//                         </svg>
//                       )}
//                     </div>
//                   </div>
//                 </div>
//               </button>
//             );
//           })}
//         </div>
//       </div>

//       {/* Empty detail placeholder so the layout reads correctly */}
//       <div className="flex flex-1 items-center justify-center bg-slate-50 text-[12px] text-slate-400">
//         Select a message to view it
//       </div>
//     </div>
//   );
// }