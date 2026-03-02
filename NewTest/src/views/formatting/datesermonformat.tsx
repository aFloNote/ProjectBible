interface DateComponentProps {
    date: string;
  }
  
  const DateComponent: React.FC<DateComponentProps> = ({ date: dateString }) => {
    let date = new Date(dateString);
	console.log(date)
	console.log("here")
    let month = date.toLocaleString('default', { month: 'short' }).toUpperCase();
	let monthFull=date.toLocaleString('default', { month: 'long' });
    let day = date.getUTCDate();
    // @ts-ignore
    let year = date.getUTCFullYear();
  
    return (
		<>
      <div className="flex flex-col lg:flex-row w-7 lg:w-full lg:items-center lg:justify-center">
        <div className='lg:hidden text-center text-gray-400 leading-tight text-sm  lg:pr-2'>{month}</div>
		<div className='hidden lg:flex text-center text-gray-400 leading-tight text-sm  lg:pr-2'>{monthFull}</div>
        <div className='hidden lg:flex text-center text-gray-400 text-2xl lg:text-sm leading-tight'>{day},</div>
		<div className='lg:hidden text-center text-gray-400 text-2xl lg:text-sm leading-tight'>{day}</div>
		
		<div className='hidden lg:block text-center text-gray-400 leading-tight text-xs lg:pl-2'>{year}</div>
		</div>
		
	  </>
    );
  }
  
  export default DateComponent;