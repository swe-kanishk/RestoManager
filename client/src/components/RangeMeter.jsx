import React from 'react';

function RangeMeter({ percentage = 0, status = '' }) {
  return (
    <div className="flex relative">
    <div className="flex !p-[1px] w-full bg-gray-200 justify-start items-center rounded-lg">
      <div
        style={{ width: `${percentage}%` }}
        className={`!p-[7px] rounded-md transition-all duration-500 ${
          status === 'Profit' ? 'bg-green-400' : 'bg-red-400'
        }`}
      ></div>
    </div>
    <span className={`!text-[12px] whitespace-nowrap absolute w-full !px-[3%] !font-bold`}>{status} of {percentage}%</span>
    </div>
  );
}

export default RangeMeter;
