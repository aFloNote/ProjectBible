interface DateComponentProps {
    date: string;
  }
  
  const DateComponent: React.FC<DateComponentProps> = ({ date: dateString }) => {
    let date = new Date(dateString);
    let month = date.toLocaleString('default', { month: 'short' }).toUpperCase();
    let day = date.getUTCDate();
    let year = date.getUTCFullYear();
  
    return (
      <div className="flex flex-col">
        <div className='text-center text-gray-400 leading-none'>{month}</div>
        <div className='text-center text-gray-400 text-4xl leading-none'>{day}</div>
       
      </div>
    );
  }
  
  export default DateComponent;