const Loading = () => {
    return (
        <div className="min-h-screen bg-base-100 flex items-center justify-center px-4">
            <div className="text-center">

                <h2 className="text-2xl font-bold tracking-tight">
                    Paws<span className="text-warning">Home</span>
                </h2>

                <p className="text-sm text-base-content/50 my-2">
                    Finding your new best friend...
                </p>

               <span className="loading loading-bars loading-xl text-warning"></span>

            </div>
        </div>
    );
};

export default Loading;
