import { FaPaw } from "react-icons/fa";

const SectionTitle = ({ title }) => {
    // Highlight the last word of the title
    const words = title.trim().split(" ");
    const lastWord = words.pop();
    const rest = words.join(" ");

    return (
        <header className="mx-auto my-10 max-w-3xl px-4 text-center md:my-24 font-dmSans">

            {/* Small paw mark */}
            <FaPaw
                aria-hidden="true"
                className="mx-auto mb-4 -rotate-12 text-lg text-warning"
            />

            <h2 className="isolate text-balance text-3xl leading-tight tracking-tight text-base-content sm:text-4xl md:text-5xl  font-extrabold">
                {rest && <>{rest} </>}

                {/* Highlighter underline behind the last word */}
                <span className="relative inline-block">
                    {lastWord}
                    <span
                        aria-hidden="true"
                        className="absolute inset-x-0 bottom-1 -z-10 h-2.5 rounded-full bg-warning/50 md:bottom-1.5 md:h-3"
                    ></span>
                </span>
            </h2>
        </header>
    );
};

export default SectionTitle;