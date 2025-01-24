'use client';

import { useState, ChangeEvent } from 'react';

export type Issue = {
  id: string;
  name: string;
  message: string;
  status: 'open' | 'resolved';
  numEvents: number;
  numUsers: number;
  value: number;
};

type CheckedState = {
  checked: boolean;
  backgroundColor: string;
};

type TableProps = {
  issues: Issue[];
};

const Table = ({ issues }: TableProps) => {
  // using map to ensure that the state is initialized correctly with a one-to-one correspondence to the issues array, and also to avoid the issues that arise when using the .fill() method for initializing arrays with objects.
  const [checkedState, setCheckedState] = useState<CheckedState[]>(
    issues.map(() => ({ checked: false, backgroundColor: '#ffffff' }))
  );
  //chnaging names for clarity and semantic improvement of variable names
  const [selectAllChecked, setSelectAllChecked] = useState(false);
  const [totalSelectedValue, setTotalSelectedValue] = useState(0);

  // Handle individual checkbox state change
  const handleRowChange = (index: number): void => {
    const updatedCheckedState = [...checkedState]; // Clone current state to update it immutably
    const newCheckedValue = !updatedCheckedState[index].checked;

    // Update the specific checkbox state
    updatedCheckedState[index].checked = newCheckedValue;
    updatedCheckedState[index].backgroundColor = newCheckedValue
      ? '#eeeeee'
      : '#ffffff';

    setCheckedState(updatedCheckedState); // Set the updated state

    // Recalculate the total selected value
    const newTotalSelected = updatedCheckedState
      .filter((state, idx) => state.checked && issues[idx].status === 'open')
      .reduce((sum, _, idx) => sum + issues[idx].value, 0);

    setTotalSelectedValue(newTotalSelected); // Update the total selected value
    updateSelectAllCheckbox(newTotalSelected); // Update Select All checkbox state
  };

  // Update the Select/Deselect All checkbox based on the current selections
  const updateSelectAllCheckbox = (totalSelected: number): void => {
    const totalOpenIssues = issues.filter(
      (issue) => issue.status === 'open'
    ).length;
    const selectAllCheckbox = document.getElementById(
      'custom-checkbox-selectAll'
    ) as HTMLInputElement | null;

    if (!selectAllCheckbox) return;

    if (totalSelected === 0) {
      selectAllCheckbox.indeterminate = false;
      setSelectAllChecked(false);
    } else if (totalSelected < totalOpenIssues) {
      selectAllCheckbox.indeterminate = true;
      setSelectAllChecked(false);
    } else {
      selectAllCheckbox.indeterminate = false;
      setSelectAllChecked(true);
    }
  };

  // Handle Select/Deselect All checkbox state change
  const handleSelectAllChange = (
    event: ChangeEvent<HTMLInputElement>
  ): void => {
    const checked = event.target.checked;
    const updatedCheckedState = issues.map((issue) => ({
      checked,
      backgroundColor: checked ? '#eeeeee' : '#ffffff',
    }));

    setCheckedState(updatedCheckedState); // Set the updated state

    // Recalculate total selected value
    const totalSelected = checked
      ? updatedCheckedState
          .filter(
            (state, idx) => state.checked && issues[idx].status === 'open'
          )
          .reduce((sum, _, idx) => sum + issues[idx].value, 0)
      : 0;

    setTotalSelectedValue(totalSelected); // Update total selected value
    setSelectAllChecked(checked); // Set Select All checkbox status
  };

  return (
    <table className='w-full border-collapse shadow-lg'>
      <thead>
        <tr className='border-2 border-gray-200'>
          <th className='py-6 pl-6 text-left w-[48px]'>
            <input
              className='w-5 h-5 cursor-pointer'
              type='checkbox'
              id='custom-checkbox-selectAll'
              checked={selectAllChecked}
              onChange={handleSelectAllChange}
            />
          </th>
          <th className='py-6 min-w-[8rem] text-left text-black'>
            {totalSelectedValue
              ? `Selected ${totalSelectedValue}`
              : 'None selected'}
          </th>
          <th colSpan={2} />
        </tr>
        <tr className='border-2 border-gray-200'>
          <th className='py-6 pl-6' />
          <th className='py-6 text-left font-medium text-black'>Name</th>
          <th className='py-6 text-left font-medium text-black'>Message</th>
          <th className='py-6 text-left font-medium text-black'>Status</th>
        </tr>
      </thead>

      <tbody>
        {issues.map(({ name, message, status }, index) => {
          const issueIsOpen = status === 'open';
          const onClick = issueIsOpen
            ? () => handleRowChange(index)
            : undefined;
          const rowClasses = `${
            issueIsOpen
              ? 'cursor-pointer hover:bg-blue-50 text-black'
              : 'text-gray-600 cursor-not-allowed'
          } border-b border-gray-200 ${
            checkedState[index].checked ? 'bg-blue-50' : ''
          }`;

          return (
            <tr className={rowClasses} key={index} onClick={onClick}>
              <td className='py-6 pl-6'>
                {issueIsOpen ? (
                  <input
                    className='w-5 h-5 cursor-pointer'
                    type='checkbox'
                    checked={checkedState[index].checked}
                    onChange={() => handleRowChange(index)}
                  />
                ) : (
                  <input
                    className='w-5 h-5 opacity-50'
                    type='checkbox'
                    disabled
                  />
                )}
              </td>
              <td className='py-6'>{name}</td>
              <td className='py-6'>{message}</td>
              <td className='py-6'>
                <div className='flex items-center gap-2'>
                  {
                    //updating logic to only add text and color in conditional redering
                  }
                  <span
                    className={`inline-block w-[15px] h-[15px] rounded-full ${
                      issueIsOpen ? 'bg-blue-600' : 'bg-gray-400'
                    }`}
                  />
                  <span className='text-gray-700 font-medium'>
                    {issueIsOpen ? 'Open' : 'Resolved'}
                  </span>
                </div>
              </td>
            </tr>
          );
        })}
      </tbody>
    </table>
  );
};

export default Table;
