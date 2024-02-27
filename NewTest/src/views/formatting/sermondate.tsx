interface DateComponentProps {
    date: string;
  }
  
  const DateComponent: React.FC<DateComponentProps> = ({ date: dateString }) => {
    let date = new Date(dateString);
    let month = date.toLocaleString('default', { month: 'long' });
    let day = date.getUTCDate();
    let year = date.getUTCFullYear();
  
    return (
        <div className="flex space-x-2">
          <div className='text-gray-500 text-xs'>{month}</div>
          <div className='text-gray-500'>{day}</div>
          <div className='text-gray-500 text-xs'>{year}</div>
        </div>
      );
    }
  
  export default DateComponent;