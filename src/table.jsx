import get from 'lodash/get';
import isFunction from 'lodash/isFunction';
import React from 'react';

class Table extends React.Component {
  getChildContext() {
    return {
      columns: this.props.columns,
      data: this.props.data,
    };
  }
  render() {
    const {
      columns, data, children, ...props, // eslint-disable-line no-unused-vars
    } = this.props;

    return <table {...props}>{children}</table>;
  }
}
Table.propTypes = {
  columns: React.PropTypes.arrayOf(
    React.PropTypes.shape({
      header: React.PropTypes.shape({
        value: React.PropTypes.string,
        transform: React.PropTypes.any, // XXX
        format: React.PropTypes.func,
        props: React.PropTypes.object,
      }),
      cell: React.PropTypes.shape({
        property: React.PropTypes.string,
        transform: React.PropTypes.any, // XXX
        format: React.PropTypes.func,
        props: React.PropTypes.object,
      }),
    })
  ).isRequired,
  data: React.PropTypes.array.isRequired,
  children: React.PropTypes.any,
};
Table.childContextTypes = {
  columns: React.PropTypes.array,
  data: React.PropTypes.array,
};

const Header = ({ children, ...props }, { columns }) => (
  <thead {...props}>
    <tr>
      {columns.map((column, i) => {
        const {
          value, transform = a => a, format = a => a, props, // eslint-disable-line no-shadow
        } = column.header;
        const key = `${i}-header`;
        const extraParameters = {
          cellKey: key,
        };

        return (
          <th key={key} {...props}>
            {transform(format(value, extraParameters), extraParameters)}
          </th>
        );
      })}
    </tr>
    {children}
  </thead>
);
Header.propTypes = {
  children: React.PropTypes.any,
};
Header.contextTypes = {
  columns: React.PropTypes.array.isRequired,
};
Header.displayName = 'Table.Header';

const Body = ({ row, rowKey, ...props }, { columns, data }) => (
  <tbody {...props}>{
    data.map((r, i) => <tr key={`${r[rowKey] || i}-row`} {...row(r, i)}>{
      columns.map((column, j) => {
        const {
          property, transform = a => a, format = a => a, props, // eslint-disable-line no-shadow
        } = column.cell;
        // TODO: give a warning if value is not found by `get`
        const value = get(r, property);
        const extraParameters = {
          cellData: data[i],
          cellKey: data[i][rowKey],
          property,
        };

        return (
          <td key={`${j}-cell`} {...props}>
            {transform(format(value, extraParameters), extraParameters)}
          </td>
        );
      })
    }</tr>)
  }</tbody>
);
Body.propTypes = {
  row: React.PropTypes.func,
  rowKey: React.PropTypes.string.isRequired,
};
Body.defaultProps = {
  row: () => {},
};
Body.contextTypes = {
  columns: React.PropTypes.array.isRequired,
  data: React.PropTypes.array.isRequired,
};
Body.displayName = 'Table.Body';

Table.Header = Header;
Table.Body = Body;

export default Table;
