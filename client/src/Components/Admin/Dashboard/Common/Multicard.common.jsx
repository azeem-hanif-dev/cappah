const MetricCard = ({
  Cardcolor,
  icon: Icon,
  title,
  value,
  pending,
  getintouch,
  enquire,
  subCategoryCount,
  completed,
  active,
  inactive,
  bgColor = "bg-primary",
  error,
  star,
}) => {
  return (
    <div
      className={`${Cardcolor} rounded-xl p-4  w-full max-w-xs md:max-w-sm lg:max-w-md shadow-lg minicontent `}
    >
      <div className="flex flex-col">
        <div className="flex items-center justify-between flex-row">
          <div className={`${bgColor} rounded-lg p-2.5`}>
            <Icon className="w-5 h-5 text-white" />
          </div>
          <div>
            <h3 className="text-slate-600 minicontent  pl-4">{title}</h3>
          </div>
        </div>

        {error ? (
          <p className="text-red-500 minicontent">{error}</p>
        ) : (
          <>
            <div className="flex flex-col space-y-10">
              {/* Card Count  */}

              <div className="flex justify-end">
                <p className="subheading3 font-semibold text-slate-800">
                  {value ?? "null"}
                </p>
              </div>
              <div className="flex justify-between w-full items-center">
                {/* Active/ Inactive Fields */}
                <div className="flex flex-col  gap-2">
                  {active !== undefined && (
                    <div className="flex items-center gap-2 text-primary microcontent">
                      <div className="w-2 h-2 rounded-full bg-primary" />
                      Active {active}
                    </div>
                  )}
                  {inactive !== undefined && (
                    <div className="flex items-center gap-2 text-error microcontent">
                      <div className="w-2 h-2 rounded-full bg-error" />
                      Inactive {inactive}
                    </div>
                  )}
                  {getintouch !== undefined && (
                    <div className="flex items-center gap-2 text-primary microcontent">
                      <div className="w-2 h-2 rounded-full bg-primary" />
                      Get in Touch {getintouch}
                    </div>
                  )}
                  {enquire !== undefined && (
                    <div className="flex items-center gap-2 text-yellow-500 microcontent">
                      <div className="w-2 h-2 rounded-full bg-yellow-500" />
                      Enquire {enquire}
                    </div>
                  )}
                  {subCategoryCount !== undefined && (
                    <div className="flex items-center gap-2 text-primary microcontent">
                      <div className="w-2 h-2 rounded-full bg-primary" />
                      Sub Category {subCategoryCount}
                    </div>
                  )}

                  {completed !== undefined && (
                    <div className="flex items-center gap-2 text-primary microcontent">
                      <div className="w-2 h-2 rounded-full bg-primary" />
                      Completed {completed}
                    </div>
                  )}
                  {pending !== undefined && (
                    <div className="flex items-center gap-2 text-yellow-500 microcontent">
                      <div className="w-2 h-2 rounded-full bg-yellow-500" />
                      Pending {pending}
                    </div>
                  )}
                </div>

                <img src={star} alt="Star" />
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};
export default MetricCard;
