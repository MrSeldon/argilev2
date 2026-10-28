export function GlazeCredits({ className = "" }: { className?: string }) {
  return (
    <footer className={`text-caption text-warm-500 leading-relaxed ${className}`}>
      <p>
        Recipes from{" "}
        <a href="https://glazy.org" target="_blank" rel="noopener noreferrer" className="underline hover:text-charcoal">
          Glazy
        </a>{" "}
        (data shared under{" "}
        <a href="https://creativecommons.org/licenses/by-nc-sa/4.0/" target="_blank" rel="noopener noreferrer" className="underline hover:text-charcoal">
          CC BY-NC-SA 4.0
        </a>
        ; each recipe credits its Glazy author) and{" "}
        <a href="https://digitalfire.com" target="_blank" rel="noopener noreferrer" className="underline hover:text-charcoal">
          Digitalfire
        </a>{" "}
        (Tony Hansen’s Digitalfire Reference Library). Descriptions here are generated from the recipes’ own fields; material analyses are typical values - your
        materials, and especially ash, lime and wild clay, will vary. Always fire a test tile first.
      </p>
    </footer>
  );
}
