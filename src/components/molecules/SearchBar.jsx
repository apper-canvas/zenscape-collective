import { useState } from 'react';
import Input from '@/components/atoms/Input';
import Button from '@/components/atoms/Button';

function SearchBar({ 
  onSearch, 
  placeholder = 'Search...', 
  className = '',
  ...props 
}) {
  const [query, setQuery] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    onSearch?.(query);
  };

  const handleClear = () => {
    setQuery('');
    onSearch?.('');
  };

  return (
    <form onSubmit={handleSubmit} className={`relative ${className}`}>
      <Input
        type="text"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder={placeholder}
        icon="Search"
        iconPosition="left"
        className="pr-20"
        {...props}
      />
      
      <div className="absolute right-2 top-1/2 transform -translate-y-1/2 flex space-x-1">
        {query && (
          <Button
            type="button"
            variant="ghost"
            size="sm"
            icon="X"
            onClick={handleClear}
            className="h-8 w-8 p-0"
          />
        )}
        
        <Button
          type="submit"
          variant="primary"
          size="sm"
          icon="Search"
          className="h-8 w-8 p-0"
          disabled={!query.trim()}
        />
      </div>
    </form>
  );
}

export default SearchBar;