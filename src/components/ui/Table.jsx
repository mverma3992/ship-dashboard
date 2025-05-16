import React from 'react';

const Table = ({
  columns,
  data,
  emptyMessage = 'No data available',
  loading = false,
  onRowClick,
  className = '',
  rowClassName = '',
  compact = false,
  striped = false,
  bordered = false,
}) => {
  const paddingClasses = compact ? 'px-4 py-2' : 'px-6 py-4';
  const stripedClasses = striped ? 'even:bg-secondary-50' : '';
  const borderedClasses = bordered ? 'border-x border-secondary-200' : '';

  return (
    <div className={`overflow-x-auto rounded-lg border border-secondary-200 bg-white shadow-sm ${className}`}>
      <table className="min-w-full divide-y divide-secondary-200">
        <thead className="bg-secondary-50">
          <tr>
            {columns.map((column) => (
              <th
                key={column.key}
                scope="col"
                className={`${compact ? 'px-4 py-3' : 'px-6 py-3.5'} text-left text-xs font-medium text-secondary-500 uppercase tracking-wider ${
                  column.headerClassName || ''
                }`}
                style={column.width ? { width: column.width } : {}}
              >
                {column.title}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-secondary-200">
          {loading ? (
            <tr>
              <td
                colSpan={columns.length}
                className={`${paddingClasses} text-center text-sm text-secondary-500`}
              >
                <div className="flex justify-center items-center space-x-2">
                  <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-primary-500"></div>
                  <span>Loading...</span>
                </div>
              </td>
            </tr>
          ) : data.length === 0 ? (
            <tr>
              <td
                colSpan={columns.length}
                className={`${paddingClasses} text-center text-sm text-secondary-500 py-8`}
              >
                {emptyMessage}
              </td>
            </tr>
          ) : (
            data.map((item, rowIndex) => (
              <tr
                key={item.id || rowIndex}
                className={`hover:bg-secondary-50 transition-colors duration-150 ${stripedClasses} ${rowClassName} ${
                  onRowClick ? 'cursor-pointer' : ''
                } ${borderedClasses}`}
                onClick={onRowClick ? () => onRowClick(item) : undefined}
              >
                {columns.map((column) => (
                  <td
                    key={`${rowIndex}-${column.key}`}
                    className={`${paddingClasses} whitespace-nowrap text-sm text-secondary-700 ${
                      column.cellClassName || ''
                    }`}
                  >
                    {column.render
                      ? column.render(item[column.key], item)
                      : item[column.key]}
                  </td>
                ))}
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
};

export default Table; 