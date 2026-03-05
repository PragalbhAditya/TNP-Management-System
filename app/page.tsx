export default function HomePage() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center text-center p-6 bg-gradient-mesh">
      <div className="glass-dark p-12 rounded-3xl border border-white/10 max-w-4xl space-y-8">
        <div className="space-y-4">
          <div className="w-16 h-16 bg-primary rounded-2xl flex items-center justify-center font-bold text-3xl mx-auto shadow-xl shadow-primary/20">N</div>
          <h1 className="text-5xl font-extrabold tracking-tight text-white sm:text-6xl">
            NCE <span className="text-primary">T&P</span> Platform
          </h1>
          <p className="text-xl text-gray-400 max-w-2xl mx-auto">
            The next-generation career catalyst for Nalanda College of Engineering.
            Streamlining placements, assessments, and preparation.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
          <a
            href="/auth/signin"
            className="px-8 py-4 rounded-2xl bg-primary text-white font-bold hover:bg-primary/90 transition-all transform hover:scale-105 shadow-xl shadow-primary/20"
          >
            Get Started
          </a>
          <a
            href="/auth/signup"
            className="px-8 py-4 rounded-2xl bg-white/5 text-white font-bold border border-white/10 hover:bg-white/10 transition-all"
          >
            Register Profile
          </a>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 pt-12 border-t border-white/5">
          <div>
            <p className="text-2xl font-bold text-white">500+</p>
            <p className="text-xs text-gray-500 uppercase tracking-widest mt-1">Students</p>
          </div>
          <div>
            <p className="text-2xl font-bold text-white">50+</p>
            <p className="text-xs text-gray-500 uppercase tracking-widest mt-1">Companies</p>
          </div>
          <div>
            <p className="text-2xl font-bold text-white">95%</p>
            <p className="text-xs text-gray-500 uppercase tracking-widest mt-1">SDR Score</p>
          </div>
          <div>
            <p className="text-2xl font-bold text-white">12 LPA</p>
            <p className="text-xs text-gray-500 uppercase tracking-widest mt-1">Avg Package</p>
          </div>
        </div>
      </div>
    </div>
  );
}
