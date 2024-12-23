const AuthImagePattern =({title , submit})=>{
    return (
        <div className="hidden lg:flex items-center jusitfy-center bg-base-200 p-12">
            <div className="max-w-md text-center">
                <div className="grid grid-cols-3 gap-3 mb-8">
                    {[...Array(9)].map((_,i)=>(
                        <div
                        key={i}
                        className={`aspect-square rounded-2xl bg-primary/10 ${i % 2 == 0 ? "animate-pulse" : "" }`}
                        />
                    ))}
                </div>
            </div>
        </div>
    )
}