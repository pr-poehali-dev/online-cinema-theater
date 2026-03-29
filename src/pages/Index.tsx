import { useState, useEffect, useRef } from "react";
import Hls from "hls.js";
import Icon from "@/components/ui/icon";

const GEROYCHIKI_EPISODES_S1 = [
  "Новые герои", "Плохая примета", "Лунная гонка", "Идеальный друг",
  "Флаг для Генерала", "Таинственная коробка", "Сладкая миссия", "Супергерой",
  "Метод Флая", "За фантазию", "Любимая игрушка", "Эмблема команды",
  "Премия Пинки", "Секрет Де-Кроля", "Одиссея Бублика", "Возвращение Пинки",
  "Одиночество Бублика", "Страшный праздник", "Хвост О-Раша", "История Ко-Ко",
  "Конкурс точилок", "Другая Глория", "Мелкотрон Крузо", "История Бублика",
  "Жаркий четверг", "Блогер"
];

const GEROYCHIKI_URLS_S1 = [
  "https://m.vkvideo.ru/playlist/-234589463_5/video-234589463_456239052?from=video&linked=1&t=4s",
  "https://m.vkvideo.ru/playlist/-234589463_5/video-234589463_456239053?from=video&linked=1",
  "https://m.vkvideo.ru/playlist/-234589463_5/video-234589463_456239054?from=video&linked=1",
  "https://m.vkvideo.ru/playlist/-234589463_5/video-234589463_456239055?from=video&linked=1&t=5s",
  "https://m.vkvideo.ru/playlist/-234589463_5/video-234589463_456239056?from=video&linked=1&t=26s",
  "https://m.vkvideo.ru/playlist/-234589463_5/video-234589463_456239057?from=video&linked=1&t=15s",
  "https://m.vkvideo.ru/playlist/-234589463_5/video-234589463_456239058?from=video&linked=1&t=1m43s",
  "https://m.vkvideo.ru/playlist/-234589463_5/video-234589463_456239059?from=video&linked=1",
  "https://m.vkvideo.ru/playlist/-234589463_5/video-234589463_456239060?from=video&linked=1",
  "https://m.vkvideo.ru/playlist/-234589463_5/video-234589463_456239063?from=video&linked=1",
  "https://m.vkvideo.ru/playlist/-234589463_5/video-234589463_456239065?from=video&linked=1",
  "https://m.vkvideo.ru/playlist/-234589463_5/video-234589463_456239070?from=video&linked=1",
  "https://m.vkvideo.ru/playlist/-234589463_5/video-234589463_456239068?from=video&linked=1",
  "https://m.vkvideo.ru/playlist/-234589463_5/video-234589463_456239071?from=video&linked=1",
  "https://m.vkvideo.ru/playlist/-234589463_5/video-234589463_456239072?from=video&linked=1",
  "https://m.vkvideo.ru/playlist/-234589463_5/video-234589463_456239073?from=video&linked=1",
  "https://m.vkvideo.ru/playlist/-234589463_5/video-234589463_456239074?from=video&linked=1&t=2m21s",
  "https://m.vkvideo.ru/playlist/-234589463_5/video-234589463_456239080?from=video&linked=1",
  "https://m.vkvideo.ru/playlist/-234589463_5/video-234589463_456239075?from=video&linked=1",
  "https://m.vkvideo.ru/playlist/-234589463_5/video-234589463_456239076?from=video&linked=1&t=32s",
  "https://m.vkvideo.ru/playlist/-234589463_5/video-234589463_456239077?from=video&linked=1",
  "https://m.vkvideo.ru/playlist/-234589463_5/video-234589463_456239079?from=video&linked=1",
  "https://m.vkvideo.ru/playlist/-234589463_5/video-234589463_456239082?from=video&linked=1",
  "https://m.vkvideo.ru/playlist/-234589463_5/video-234589463_456239083?from=video&linked=1&t=3m10s",
  "https://m.vkvideo.ru/playlist/-234589463_5/video-234589463_456239085?from=video&linked=1",
  "https://m.vkvideo.ru/playlist/-234589463_5/video-234589463_456239087?from=video&linked=1",
];

const TV_CHANNELS = [
  { name: "Первый канал", emoji: "1️⃣", color: "from-blue-700 to-blue-900", stream: "http://rt-vlg-nn-htlive.cdn.ngenix.net/hls/CH_R03_OTT_VLG_NN_1TV/variant.m3u8?version=2" },
  { name: "Россия 1", emoji: "📺", color: "from-blue-600 to-blue-800", stream: "https://vgtrkregion-reg.cdnvideo.ru/vgtrk/elista/russia1-sd/index.m3u8" },
  { name: "НТВ", emoji: "🎬", color: "from-green-600 to-green-800", stream: "https://zabava-htlive.cdn.ngenix.net/hls/CH_NTV/variant.m3u8" },
  { name: "Россия 24", emoji: "📡", color: "from-blue-500 to-cyan-700", stream: "https://vgtrkregion-reg.cdnvideo.ru/vgtrk/bryansk/russia24-sd/index.m3u8" },
  { name: "Пятый канал", emoji: "5️⃣", color: "from-yellow-500 to-orange-600", stream: "https://zabava-htlive.cdn.ngenix.net/hls/CH_5TV/variant.m3u8" },
  { name: "РЕН ТВ", emoji: "🔥", color: "from-red-600 to-rose-800", stream: "https://zabava-htlive.cdn.ngenix.net/hls/CH_RENTV/variant.m3u8" },
  { name: "СТС", emoji: "✨", color: "from-pink-500 to-purple-700", stream: "https://zabava-htlive.cdn.ngenix.net/hls/CH_STS/variant.m3u8" },
  { name: "ТНТ", emoji: "😂", color: "from-yellow-400 to-yellow-600", stream: "https://streaming.televizor-24-tochka.ru/live/38.m3u8" },
  { name: "Матч ТВ", emoji: "⚽", color: "from-orange-500 to-red-600", stream: "" },
  { name: "Культура", emoji: "🎭", color: "from-indigo-600 to-violet-800", stream: "https://vgtrkregion-reg.cdnvideo.ru/vgtrk/0/kultura-hd/index.m3u8" },
  { name: "ОТР", emoji: "🌍", color: "from-teal-500 to-emerald-700", stream: "https://zabava-htlive.cdn.ngenix.net/hls/CH_OTR/variant.m3u8" },
  { name: "ТВК", emoji: "📻", color: "from-slate-500 to-slate-700", stream: "" },
];

const SERIES_LIST = [
  {
    id: "geroychiki",
    title: "Геройчики",
    ageRating: "0+",
    seasons: 2,
    episodes: 26,
    years: "2022–2023",
    description: "Мальчик Рома очень любит играть, поэтому в его комнате полным-полно разных игрушек. Кого здесь только нет: и загадочный пушистый инопланетянин Бублик, и отважный петух-тянучка Ко-Ко, и благородная ящерица-самурай О-Раш, и милая куколка Пинки, и воинственный плюшевый заяц Генерал Де-Кроль со своими роботами, и, конечно, отважные супергерои Флай и Глория.",
    poster: "https://cdn.poehali.dev/projects/d3a8050d-aa30-4409-b456-56c9d75ebca7/files/ed0a88b7-15b8-45c6-aed9-084c32e3df40.jpg",
    episodes_s1: GEROYCHIKI_EPISODES_S1,
    urls_s1: GEROYCHIKI_URLS_S1,
    color: "from-orange-500 to-pink-600",
  },
  {
    id: "um-i-khrum",
    title: "Ум и Хрум",
    ageRating: "0+",
    seasons: 1,
    episodes: 0,
    years: "скоро",
    description: "Описание появится позже.",
    poster: "https://cdn.poehali.dev/projects/d3a8050d-aa30-4409-b456-56c9d75ebca7/files/9fd243be-7d1f-4703-be46-4554c711ff3d.jpg",
    episodes_s1: [],
    urls_s1: [],
    color: "from-purple-500 to-indigo-600",
  }
];

type Section = "home" | "cartoons" | "tv" | "search";

export default function Index() {
  const [section, setSection] = useState<Section>("home");
  const [favorites, setFavorites] = useState<string[]>(() => {
    try { return JSON.parse(localStorage.getItem("poehali_fav") || "[]"); } catch { return []; }
  });
  const [selectedSeries, setSelectedSeries] = useState<typeof SERIES_LIST[0] | null>(null);
  const [selectedSeason, setSelectedSeason] = useState(1);
  const [playingEp, setPlayingEp] = useState<{ title: string; url: string } | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [mobileMenu, setMobileMenu] = useState(false);
  const [playingChannel, setPlayingChannel] = useState<typeof TV_CHANNELS[0] | null>(null);

  useEffect(() => {
    localStorage.setItem("poehali_fav", JSON.stringify(favorites));
  }, [favorites]);

  const toggleFavorite = (id: string) => {
    setFavorites(prev => prev.includes(id) ? prev.filter(f => f !== id) : [...prev, id]);
  };

  const isFav = (id: string) => favorites.includes(id);

  const searchResults = searchQuery.trim().length > 1
    ? SERIES_LIST.filter(s => s.title.toLowerCase().includes(searchQuery.toLowerCase()))
    : [];

  const openSeries = (s: typeof SERIES_LIST[0]) => {
    setSelectedSeries(s);
    setSelectedSeason(1);
    setPlayingEp(null);
  };

  const navItems = [
    { id: "home", label: "Главная", icon: "Home" },
    { id: "cartoons", label: "Мультсериалы", icon: "Tv2" },
    { id: "tv", label: "ТВ-каналы", icon: "Radio" },
    { id: "search", label: "Поиск", icon: "Search" },
  ] as const;

  return (
    <div className="min-h-screen font-golos">
      {/* NAVBAR */}
      <nav className="fixed top-0 left-0 right-0 z-50 glass border-b border-white/5">
        <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
          <button
            onClick={() => { setSection("home"); setSelectedSeries(null); setPlayingEp(null); }}
            className="flex items-center gap-2"
          >
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-orange-500 to-pink-600 flex items-center justify-center">
              <Icon name="Rocket" size={16} className="text-white" />
            </div>
            <span className="font-montserrat font-black text-lg tracking-tight gradient-text">Поехали</span>
          </button>

          <div className="hidden md:flex items-center gap-8">
            {navItems.map(item => (
              <button
                key={item.id}
                onClick={() => { setSection(item.id); setSelectedSeries(null); setPlayingEp(null); }}
                className={`nav-link flex items-center gap-1.5 text-sm font-medium transition-colors ${section === item.id ? "text-orange-400 active" : "text-white/60 hover:text-white"}`}
              >
                <Icon name={item.icon} size={15} />
                {item.label}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => { setSection("search"); setSelectedSeries(null); }}
              className="md:hidden p-2 text-white/60 hover:text-white transition-colors"
            >
              <Icon name="Search" size={20} />
            </button>
            <button
              onClick={() => setMobileMenu(v => !v)}
              className="md:hidden p-2 text-white/60 hover:text-white transition-colors"
            >
              <Icon name={mobileMenu ? "X" : "Menu"} size={20} />
            </button>
            <div className="hidden md:flex items-center gap-1.5 px-3 py-1.5 rounded-full glass text-xs text-white/50">
              <Icon name="Heart" size={12} className="text-pink-400" />
              {favorites.length} в избранном
            </div>
          </div>
        </div>

        {mobileMenu && (
          <div className="md:hidden border-t border-white/5 px-4 py-3 flex flex-col gap-1 animate-fadeIn">
            {navItems.map(item => (
              <button
                key={item.id}
                onClick={() => { setSection(item.id); setSelectedSeries(null); setMobileMenu(false); }}
                className={`flex items-center gap-2 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${section === item.id ? "bg-orange-500/10 text-orange-400" : "text-white/60 hover:bg-white/5 hover:text-white"}`}
              >
                <Icon name={item.icon} size={16} />
                {item.label}
              </button>
            ))}
          </div>
        )}
      </nav>

      <main className="pt-16">
        {/* PLAYER MODAL */}
        {playingEp && (
          <div
            className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center animate-fadeIn"
            onClick={() => setPlayingEp(null)}
          >
            <div
              className="w-full max-w-4xl mx-4 rounded-2xl overflow-hidden glass border border-white/10 animate-fadeInUp"
              onClick={e => e.stopPropagation()}
            >
              <div className="flex items-center justify-between px-5 py-4 border-b border-white/10">
                <div>
                  <p className="text-xs text-white/40 uppercase tracking-widest font-montserrat">{selectedSeries?.title}</p>
                  <h3 className="font-montserrat font-bold text-white">{playingEp.title}</h3>
                </div>
                <button onClick={() => setPlayingEp(null)} className="p-2 rounded-full hover:bg-white/10 text-white/60 hover:text-white transition-colors">
                  <Icon name="X" size={20} />
                </button>
              </div>
              <div className="aspect-video bg-black">
                <iframe
                  src={playingEp.url}
                  className="w-full h-full"
                  allowFullScreen
                  allow="autoplay; fullscreen; encrypted-media"
                  frameBorder="0"
                />
              </div>
            </div>
          </div>
        )}

        {/* SERIES DETAIL */}
        {selectedSeries && !playingEp && (
          <div className="max-w-7xl mx-auto px-4 py-8 animate-fadeInUp">
            <button
              onClick={() => setSelectedSeries(null)}
              className="flex items-center gap-2 text-white/50 hover:text-white mb-8 transition-colors text-sm"
            >
              <Icon name="ArrowLeft" size={16} />
              Назад
            </button>

            <div className="flex flex-col md:flex-row gap-8 mb-10">
              <div className="w-full md:w-64 flex-shrink-0">
                <div className="relative rounded-2xl overflow-hidden aspect-[3/4]">
                  <img src={selectedSeries.poster} alt={selectedSeries.title} className="w-full h-full object-cover" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />
                  <div className="absolute top-3 left-3 flex gap-1.5">
                    <span className="px-2 py-0.5 rounded bg-black/60 text-xs font-montserrat font-bold text-white">{selectedSeries.ageRating}</span>
                    <span className="px-2 py-0.5 rounded bg-orange-500/80 text-xs font-montserrat font-bold text-white">{selectedSeries.seasons} сезона</span>
                  </div>
                </div>
              </div>
              <div className="flex-1 flex flex-col justify-center">
                <h1 className="font-montserrat font-black text-4xl md:text-5xl text-white mb-3">{selectedSeries.title}</h1>
                <div className="flex flex-wrap gap-4 mb-5">
                  <span className="flex items-center gap-1.5 text-sm text-white/50">
                    <Icon name="Calendar" size={14} />
                    {selectedSeries.years}
                  </span>
                  <span className="flex items-center gap-1.5 text-sm text-white/50">
                    <Icon name="Film" size={14} />
                    {selectedSeries.episodes} серий в 1 сезоне
                  </span>
                </div>
                <p className="text-white/60 leading-relaxed text-sm md:text-base max-w-2xl mb-6">{selectedSeries.description}</p>
                <div className="flex gap-3 flex-wrap">
                  {selectedSeries.urls_s1.length > 0 && (
                    <button
                      onClick={() => setPlayingEp({ title: selectedSeries.episodes_s1[0], url: selectedSeries.urls_s1[0] })}
                      className="flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-orange-500 to-pink-600 text-white font-montserrat font-semibold hover:opacity-90 transition-opacity"
                    >
                      <Icon name="Play" size={18} />
                      Смотреть с 1 серии
                    </button>
                  )}
                  <button
                    onClick={() => toggleFavorite(selectedSeries.id)}
                    className={`flex items-center gap-2 px-5 py-3 rounded-xl border font-montserrat font-semibold text-sm transition-all ${isFav(selectedSeries.id) ? "border-pink-500 bg-pink-500/10 text-pink-400" : "border-white/20 text-white/60 hover:border-white/40 hover:text-white"}`}
                  >
                    <Icon name={isFav(selectedSeries.id) ? "HeartOff" : "Heart"} size={16} />
                    {isFav(selectedSeries.id) ? "В избранном" : "В избранное"}
                  </button>
                </div>
              </div>
            </div>

            {selectedSeries.seasons > 1 && (
              <div className="flex gap-2 mb-6">
                {[1, 2].map(s => (
                  <button
                    key={s}
                    onClick={() => setSelectedSeason(s)}
                    className={`px-5 py-2 rounded-xl text-sm font-montserrat font-semibold transition-all ${selectedSeason === s ? "bg-gradient-to-r from-orange-500 to-pink-600 text-white" : "glass text-white/50 hover:text-white"}`}
                  >
                    Сезон {s}
                  </button>
                ))}
              </div>
            )}

            {selectedSeason === 1 && selectedSeries.episodes_s1.length > 0 && (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                {selectedSeries.episodes_s1.map((ep, i) => (
                  <button
                    key={i}
                    onClick={() => setPlayingEp({ title: ep, url: selectedSeries.urls_s1[i] })}
                    className="flex items-center gap-4 p-4 rounded-xl glass border border-white/5 hover:border-orange-500/30 hover:bg-orange-500/5 transition-all group text-left animate-fadeInUp"
                    style={{ animationDelay: `${i * 0.03}s`, animationFillMode: "forwards" }}
                  >
                    <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-orange-500/20 to-pink-600/20 flex items-center justify-center flex-shrink-0 group-hover:from-orange-500/40 group-hover:to-pink-600/40 transition-all">
                      <span className="font-montserrat font-bold text-orange-400 text-sm">{i + 1}</span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-white/80 text-sm font-medium group-hover:text-white transition-colors truncate">{ep}</p>
                      <p className="text-white/30 text-xs mt-0.5">Серия {i + 1} · Сезон 1</p>
                    </div>
                    <Icon name="Play" size={14} className="text-white/20 group-hover:text-orange-400 transition-colors flex-shrink-0" />
                  </button>
                ))}
              </div>
            )}

            {selectedSeason === 2 && (
              <div className="glass rounded-2xl p-12 text-center border border-white/5">
                <Icon name="Clock" size={36} className="text-white/20 mx-auto mb-3" />
                <p className="text-white/40 font-medium">Серии 2 сезона будут добавлены позже</p>
              </div>
            )}
          </div>
        )}

        {/* HOME */}
        {section === "home" && !selectedSeries && (
          <div className="animate-fadeIn">
            <div
              className="relative min-h-[500px] flex items-end pb-16 px-4 overflow-hidden"
              style={{ background: "linear-gradient(135deg, #0d1117 0%, #1a0a2e 40%, #0d1a1f 100%)" }}
            >
              <div
                className="absolute inset-0 pointer-events-none"
                style={{ backgroundImage: `radial-gradient(ellipse at 30% 40%, rgba(255,106,0,0.15) 0%, transparent 55%), radial-gradient(ellipse at 75% 65%, rgba(124,58,237,0.15) 0%, transparent 55%)` }}
              />
              <div className="max-w-7xl mx-auto w-full relative z-10">
                <div className="max-w-2xl">
                  <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full glass text-xs text-orange-400 font-montserrat font-semibold uppercase tracking-widest mb-6 animate-fadeInUp">
                    <span className="w-1.5 h-1.5 rounded-full bg-orange-400 animate-pulse" />
                    Онлайн кинотеатр
                  </div>
                  <h1 className="font-montserrat font-black text-5xl md:text-7xl text-white leading-none mb-4 animate-fadeInUp delay-100">
                    Смотри<br />
                    <span className="gradient-text">всё подряд</span>
                  </h1>
                  <p className="text-white/50 text-lg mb-8 animate-fadeInUp delay-200">
                    Мультсериалы, ТВ-каналы и любимый контент — в одном месте
                  </p>
                  <div className="flex flex-wrap gap-3 animate-fadeInUp delay-300">
                    <button
                      onClick={() => setSection("cartoons")}
                      className="flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-orange-500 to-pink-600 text-white font-montserrat font-semibold hover:opacity-90 transition-opacity"
                    >
                      <Icon name="Tv2" size={18} />
                      Мультсериалы
                    </button>
                    <button
                      onClick={() => setSection("tv")}
                      className="flex items-center gap-2 px-6 py-3 rounded-xl glass border border-white/10 text-white font-montserrat font-semibold hover:border-white/30 transition-all"
                    >
                      <Icon name="Radio" size={18} />
                      ТВ-каналы
                    </button>
                  </div>
                </div>
              </div>
            </div>

            <div className="max-w-7xl mx-auto px-4 py-10">
              <div className="flex items-center justify-between mb-6">
                <h2 className="font-montserrat font-bold text-xl text-white">Мультсериалы</h2>
                <button onClick={() => setSection("cartoons")} className="text-orange-400 text-sm hover:text-orange-300 transition-colors flex items-center gap-1">
                  Все <Icon name="ChevronRight" size={14} />
                </button>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {SERIES_LIST.map((s, i) => (
                  <SeriesCard key={s.id} series={s} isFav={isFav(s.id)} onToggleFav={() => toggleFavorite(s.id)} onOpen={() => openSeries(s)} index={i} />
                ))}
              </div>

              <div className="mt-12">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="font-montserrat font-bold text-xl text-white">ТВ-каналы</h2>
                  <button onClick={() => setSection("tv")} className="text-orange-400 text-sm hover:text-orange-300 transition-colors flex items-center gap-1">
                    Все <Icon name="ChevronRight" size={14} />
                  </button>
                </div>
                <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-3">
                  {TV_CHANNELS.slice(0, 6).map((ch, i) => (
                    <ChannelCard key={ch.name} channel={ch} index={i} onPlay={() => { setSection("tv"); setPlayingChannel(ch); }} />
                  ))}
                </div>
              </div>

              {favorites.length > 0 && (
                <div className="mt-12">
                  <h2 className="font-montserrat font-bold text-xl text-white mb-6 flex items-center gap-2">
                    <Icon name="Heart" size={18} className="text-pink-400" />
                    Избранное
                  </h2>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {SERIES_LIST.filter(s => favorites.includes(s.id)).map((s, i) => (
                      <SeriesCard key={s.id} series={s} isFav={true} onToggleFav={() => toggleFavorite(s.id)} onOpen={() => openSeries(s)} index={i} />
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* CARTOONS */}
        {section === "cartoons" && !selectedSeries && (
          <div className="max-w-7xl mx-auto px-4 py-10 animate-fadeIn">
            <div className="mb-8">
              <h1 className="font-montserrat font-black text-3xl md:text-4xl text-white mb-2">Мультсериалы</h1>
              <p className="text-white/40 text-sm">Смотри любимые мультсериалы онлайн</p>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
              {SERIES_LIST.map((s, i) => (
                <SeriesCard key={s.id} series={s} isFav={isFav(s.id)} onToggleFav={() => toggleFavorite(s.id)} onOpen={() => openSeries(s)} index={i} />
              ))}
            </div>
          </div>
        )}

        {/* TV */}
        {section === "tv" && (
          <div className="max-w-7xl mx-auto px-4 py-10 animate-fadeIn">
            {playingChannel ? (
              <div className="animate-fadeInUp">
                <button
                  onClick={() => setPlayingChannel(null)}
                  className="flex items-center gap-2 text-white/50 hover:text-white mb-6 transition-colors text-sm"
                >
                  <Icon name="ArrowLeft" size={16} />
                  Все каналы
                </button>
                <div className="rounded-2xl overflow-hidden glass border border-white/10">
                  <div className="flex items-center gap-3 px-5 py-4 border-b border-white/10">
                    <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${playingChannel.color} flex items-center justify-center text-xl`}>
                      {playingChannel.emoji}
                    </div>
                    <div>
                      <h2 className="font-montserrat font-bold text-white">{playingChannel.name}</h2>
                      <div className="flex items-center gap-1.5 text-xs text-green-400">
                        <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
                        Прямой эфир
                      </div>
                    </div>
                  </div>
                  <HlsPlayer streamUrl={playingChannel.stream} channelName={playingChannel.name} embedUrl={(playingChannel as typeof TV_CHANNELS[0] & { embedUrl?: string }).embedUrl} />
                </div>
              </div>
            ) : (
              <>
                <div className="mb-8">
                  <h1 className="font-montserrat font-black text-3xl md:text-4xl text-white mb-2">ТВ-каналы</h1>
                  <p className="text-white/40 text-sm">Нажми на канал, чтобы смотреть прямой эфир</p>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                  {TV_CHANNELS.map((ch, i) => (
                    <ChannelCard key={ch.name} channel={ch} index={i} large onPlay={() => setPlayingChannel(ch)} />
                  ))}
                </div>
              </>
            )}
          </div>
        )}

        {/* SEARCH */}
        {section === "search" && !selectedSeries && (
          <div className="max-w-3xl mx-auto px-4 py-10 animate-fadeIn">
            <h1 className="font-montserrat font-black text-3xl text-white mb-6">Поиск</h1>
            <div className="relative mb-8">
              <Icon name="Search" size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-white/30" />
              <input
                type="text"
                placeholder="Введите название..."
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                autoFocus
                className="w-full pl-12 pr-10 py-4 rounded-2xl glass border border-white/10 focus:border-orange-500/50 text-white placeholder-white/30 outline-none text-base transition-colors bg-transparent font-golos"
              />
              {searchQuery && (
                <button onClick={() => setSearchQuery("")} className="absolute right-4 top-1/2 -translate-y-1/2 text-white/30 hover:text-white transition-colors">
                  <Icon name="X" size={16} />
                </button>
              )}
            </div>

            {searchQuery.trim().length > 1 && searchResults.length === 0 && (
              <div className="text-center py-16">
                <Icon name="SearchX" size={40} className="text-white/15 mx-auto mb-3" />
                <p className="text-white/30">Ничего не найдено по запросу «{searchQuery}»</p>
              </div>
            )}

            {searchQuery.trim().length > 1 && searchResults.length > 0 && (
              <div className="grid grid-cols-2 gap-4">
                {searchResults.map((s, i) => (
                  <SeriesCard key={s.id} series={s} isFav={isFav(s.id)} onToggleFav={() => toggleFavorite(s.id)} onOpen={() => openSeries(s)} index={i} />
                ))}
              </div>
            )}

            {searchQuery.trim().length <= 1 && (
              <div className="text-center py-16">
                <Icon name="Popcorn" size={40} className="text-white/15 mx-auto mb-3" />
                <p className="text-white/30 text-sm">Начни вводить название мультсериала</p>
              </div>
            )}
          </div>
        )}
      </main>

      {!selectedSeries && (
        <footer className="mt-16 border-t border-white/5 py-8">
          <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <Icon name="Rocket" size={14} className="text-orange-400" />
              <span className="text-white/30 text-sm font-montserrat font-bold">Поехали</span>
            </div>
            <p className="text-white/20 text-xs">Онлайн кинотеатр · {new Date().getFullYear()}</p>
          </div>
        </footer>
      )}
    </div>
  );
}

function SeriesCard({
  series, isFav, onToggleFav, onOpen, index
}: {
  series: typeof SERIES_LIST[0];
  isFav: boolean;
  onToggleFav: () => void;
  onOpen: () => void;
  index: number;
}) {
  return (
    <div
      className="group relative rounded-2xl overflow-hidden card-hover cursor-pointer animate-fadeInUp"
      style={{ animationDelay: `${index * 0.08}s`, animationFillMode: "forwards", opacity: 0 }}
    >
      <div className="aspect-[3/4] relative" onClick={onOpen}>
        <img src={series.poster} alt={series.title} className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/10 to-transparent" />
        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
          <div className="w-14 h-14 rounded-full bg-white/10 backdrop-blur-sm flex items-center justify-center border border-white/20">
            <Icon name="Play" size={22} className="text-white ml-1" />
          </div>
        </div>
        <div className="absolute top-2 left-2 flex gap-1.5">
          <span className="px-1.5 py-0.5 rounded bg-black/60 text-xs font-montserrat font-bold text-white">{series.ageRating}</span>
        </div>
        <div className="absolute bottom-0 left-0 right-0 p-3">
          <h3 className="font-montserrat font-bold text-white text-sm leading-tight">{series.title}</h3>
          <p className="text-white/40 text-xs mt-0.5">{series.years} · {series.seasons} сез.</p>
        </div>
      </div>
      <button
        onClick={e => { e.stopPropagation(); onToggleFav(); }}
        className={`absolute top-2 right-2 w-7 h-7 rounded-full flex items-center justify-center transition-all ${isFav ? "bg-pink-500 text-white" : "bg-black/50 text-white/40 hover:bg-black/70 hover:text-pink-400"}`}
      >
        <Icon name="Heart" size={12} />
      </button>
    </div>
  );
}

function ChannelCard({ channel, index, large = false, onPlay }: {
  channel: typeof TV_CHANNELS[0];
  index: number;
  large?: boolean;
  onPlay?: () => void;
}) {
  const hasStream = !!channel.stream || !!(channel as typeof channel & { embedUrl?: string }).embedUrl;
  return (
    <button
      onClick={onPlay}
      disabled={!hasStream}
      className={`group channel-card flex flex-col items-center justify-center rounded-2xl glass border border-white/5 hover:border-orange-500/30 transition-all card-hover animate-fadeInUp w-full ${large ? "p-6 gap-3" : "p-4 gap-2"} ${!hasStream ? "opacity-50 cursor-not-allowed" : "cursor-pointer"}`}
      style={{ animationDelay: `${index * 0.06}s`, animationFillMode: "forwards", opacity: 0 }}
    >
      <div className={`${large ? "w-14 h-14 text-3xl" : "w-10 h-10 text-2xl"} rounded-xl bg-gradient-to-br ${channel.color} flex items-center justify-center`}>
        {channel.emoji}
      </div>
      <span className={`font-montserrat font-bold text-white/80 group-hover:text-white transition-colors text-center leading-tight ${large ? "text-sm" : "text-xs"}`}>
        {channel.name}
      </span>
      <span className="flex items-center gap-1 text-xs text-green-400">
        <span className={`w-1.5 h-1.5 rounded-full ${hasStream ? "bg-green-400" : "bg-white/20"}`} />
        {large ? (hasStream ? "Смотреть" : "Скоро") : ""}
      </span>
    </button>
  );
}

function HlsPlayer({ streamUrl, channelName, embedUrl }: { streamUrl: string; channelName: string; embedUrl?: string }) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(true);



  useEffect(() => {
    const video = videoRef.current;
    if (!video || !streamUrl) return;
    setError(false);
    setLoading(true);

    if (Hls.isSupported()) {
      const hls = new Hls({ enableWorker: false });
      hls.loadSource(streamUrl);
      hls.attachMedia(video);
      hls.on(Hls.Events.MANIFEST_PARSED, () => {
        setLoading(false);
        video.play().catch(() => {});
      });
      hls.on(Hls.Events.ERROR, (_event, data) => {
        if (data.fatal) { setError(true); setLoading(false); }
      });
      return () => hls.destroy();
    } else if (video.canPlayType("application/vnd.apple.mpegurl")) {
      video.src = streamUrl;
      video.addEventListener("loadedmetadata", () => { setLoading(false); video.play().catch(() => {}); });
      video.addEventListener("error", () => { setError(true); setLoading(false); });
    }
  }, [streamUrl]);

  if (error) {
    return (
      <div className="aspect-video bg-black flex items-center justify-center">
        <div className="text-center px-6">
          <Icon name="WifiOff" size={36} className="text-white/20 mx-auto mb-3" />
          <p className="text-white/40 text-sm">Трансляция временно недоступна</p>
          <p className="text-white/20 text-xs mt-1">{channelName}</p>
        </div>
      </div>
    );
  }

  if (embedUrl) {
    return (
      <div className="relative aspect-video bg-black">
        <iframe
          src={embedUrl}
          className="w-full h-full"
          allowFullScreen
          allow="autoplay; fullscreen"
          frameBorder="0"
        />
      </div>
    );
  }

  return (
    <div className="relative aspect-video bg-black">
      {loading && (
        <div className="absolute inset-0 flex items-center justify-center z-10">
          <div className="flex flex-col items-center gap-3">
            <div className="w-10 h-10 rounded-full border-2 border-orange-500/30 border-t-orange-500 animate-spin" />
            <p className="text-white/40 text-xs font-montserrat">Загружаем эфир...</p>
          </div>
        </div>
      )}
      <video
        ref={videoRef}
        className="w-full h-full"
        controls
        playsInline
        muted
      />
    </div>
  );
}