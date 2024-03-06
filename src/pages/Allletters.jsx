import React, { useEffect } from 'react'
import { useAuth } from '../context/AuthContext'
import { useState } from 'react'
import {
  getAllLetters,
  getAllUsers,
  getLetterByNumber,
  getLettersByDate,
  getLettersCreatedBy,
  getAllDepartments,
  getLettersFromTo,
} from '../api/axiosApi'
// import useDebounce from '../hooks/useDebounce'
import { useQuery } from '@tanstack/react-query'
import Select from 'react-select'
import {
  AdjustmentsHorizontal,
  DeleteXIcon,
  DoubleLeft,
  DoubleRight,
  IncreasedMessageIcon,
  MagnifyingGlass,
  TrashIcon,
  UpdateIcon,
} from '../assets/HeroIcons'
import DeleteLetter from './DeleteLetter'
import { nanoid } from 'nanoid'
import UpdateLetter from './UpdateLetter'
import PostLetter from './PostLetter'

const AllLetters = () => {
  const { auth } = useAuth()
  const { jwtToken } = auth || null
  const [pageSize, setPageSize] = useState(10)
  const [pageNumber, setPageNumber] = useState(0)
  const [sortBy, setSortBy] = useState('letterNo')
  const [search, setSearch] = useState('')
  // const debouncedSearch = useDebounce(search, 500)
  const [apiCall, setApiCall] = useState('number')
  const [fromDepartment, setFromDepartment] = useState('')
  const [toDepartment, setToDepartment] = useState('')
  const [user, setUser] = useState(null)
  const [letterNoSearch, setLetterNoSearch] = useState(false)
  const [deleteOpen, setDeleteOpen] = useState(false)
  const [updateOpen, setUpdateOpen] = useState(false)
  const [postOpen, setPostOpen] = useState(false)
  const [letterToDeleteId, setLetterToDeleteId] = useState(null)
  const [letterNumberToDelete, setLetterNumberToDelete] = useState(null)
  const [letterToUpdateId, setLetterToUpdateId] = useState(null)

  const { isLoading, data: letters } = useQuery({
    queryKey: ['lettersData', pageSize, pageNumber, sortBy, search, apiCall, fromDepartment, toDepartment],
    queryFn: () => {
      if (apiCall === 'time' && search !== '') {
        return getLettersByDate(search, pageSize, pageNumber, sortBy, jwtToken)
      } else if (apiCall === 'from and to') {
        return getLettersFromTo(fromDepartment, toDepartment, pageSize, pageNumber, sortBy, jwtToken)
      } else if (apiCall === 'created by' && search !== '') {
        return getLettersCreatedBy(search, pageSize, pageNumber, sortBy, jwtToken)
      } else {
        return getAllLetters(jwtToken, pageSize, pageNumber, sortBy)
      }
    },
    staleTime: 1000 * 60 * 5,
    enabled: !!jwtToken,
  })
  useEffect(() => {
    setSearch('')
    setLetterNoSearch('')
    setFromDepartment('')
    setToDepartment('')
    setUser('')
    setPageNumber(0)
    setPageSize(10)
  }, [apiCall])

  useEffect(() => {
    setPageNumber(0)
    setPageSize(10)
  }, [search, fromDepartment, toDepartment])

  const { data: departmentsList } = useQuery({
    queryKey: ['departments', jwtToken],
    queryFn: () => getAllDepartments(jwtToken),
  })

  const { data: users } = useQuery({
    queryKey: ['users', jwtToken],
    queryFn: () => getAllUsers(jwtToken),
  })

  const { data: letterByNo, isLoading: nomLoading } = useQuery({
    queryKey: ['letters', jwtToken, letterNoSearch],
    queryFn: () => getLetterByNumber(letterNoSearch, jwtToken),
    enabled: !!letterNoSearch,
  })

  const departmentOptions = departmentsList?.map((department) => ({
    value: department.name,
    label: department.name,
  }))

  const userOptions = users?.map((user) => ({
    value: user.id,
    label: `${user.firstName} ${user.lastName} ${user.fatherName}`,
  }))

  const handlePreviousPage = () => {
    if (pageNumber > 0) {
      setPageNumber((prevPageNumber) => prevPageNumber - 1)
    }
  }

  const handlePageSizeChange = (event) => {
    setPageSize(parseInt(event.target.value, 10))
    setPageNumber(0)
  }

  const handleNextPage = () => {
    if (!letters.last) {
      setPageNumber((prevPageNumber) => prevPageNumber + 1)
    }
  }

  const handleSearchİnputChange = (e) => {
    const value = e.target.value
    const sanitizedValue = value.replace(/[^\w\dƏəХх-\s]/g, '')
    setSearch(sanitizedValue)
  }

  const handleApiChange = (e) => {
    const selectedValue = e.target.value
    setApiCall(selectedValue)
  }

  const handleSortChange = (event) => {
    setSortBy(event.target.value)
    setPageNumber(0)
  }

  const handleDelete = (id, letterNo) => {
    setDeleteOpen(true)
    setLetterToDeleteId(id)
    setLetterNumberToDelete(letterNo)
  }

  const handleUpdate = (id) => {
    setUpdateOpen(true)
    setLetterToUpdateId(id)
  }

  const customSelectStyles = {
    placeholder: (baseStyles, state) => ({
      ...baseStyles,
      color: '#4a5568',
    }),
    control: (baseStyles, state) => ({
      ...baseStyles,
      // borderColor: 'rgb(0, 238, 255)',
      // borderWidth: '2px',
      borderRadius: '30px',
      // transition: 'border-color 0.2s ease',
      backgroundColor: '#FEF08A',
      // '&:hover': {
      //   borderColor: 'rgb(0, 238, 255)',
      // },
    }),
  }
  // bg-gradient-to-r from-gray-300 to-gray-100
  return (
    <div className="w-[97%]">
      {/* <EyeBalls /> */}
      <div className="custom-box-shadow -mb-6 ml-6 mt-1 w-full rounded-2xl border-2 border-b-0 border-purple-950 bg-gradient-to-r from-gray-200 to-gray-50 pb-6 text-center text-lg font-bold text-black">
        Məktubların siyahısı
      </div>
      {/* min-h-[92%]*/}
      <div className="custom-box-shadow mb-auto ml-6 mr-5 mt-auto h-auto  w-full flex-grow rounded-2xl rounded-tl-none rounded-tr-none border-2 border-purple-950 bg-gradient-to-r from-gray-200 to-gray-50 py-2 shadow-lg">
        <div className="mb-1 mr-1 flex min-h-[8%] items-center justify-center gap-6 pb-1">
          <div className="group flex cursor-pointer items-center rounded-md bg-darkblue-100 p-0 transition-all duration-300 hover:bg-darkblue-300">
            <button
              className=" px-2 py-1 text-white transition duration-200"
              onClick={() => setPostOpen(true)}
            >
              <IncreasedMessageIcon />
              <span
                className={`pointer-events-none invisible absolute mt-1.5 rounded-md bg-darkblue-400 px-2 py-1 text-center text-sm text-white opacity-0 transition-all duration-150 group-hover:visible group-hover:opacity-100 ${
                  postOpen ? 'scale-0' : 'transition-none'
                }`}
              >
                Məktubu yarat
              </span>
            </button>
            <PostLetter postOpen={postOpen} onPostClose={() => setPostOpen(false)} />
          </div>
          <div className="ml-2 flex items-center justify-center gap-2 rounded-lg  bg-darkblue-200 px-2 py-1.5">
            <button
              onClick={handlePreviousPage}
              className="focus:shadow-outline rounded-md border-2 border-oceanblue bg-white px-1 py-0.5 text-[14px] font-bold text-red-950 hover:bg-gray-100 focus:outline-none disabled:bg-gray-300"
              disabled={letters?.first || !letters}
            >
              <DoubleLeft />
            </button>
            <select
              value={pageSize}
              onChange={handlePageSizeChange}
              className="rounded-md border-2 border-oceanblue px-0 py-0.5  focus:outline-none"
            >
              <option value="5">5</option>
              <option value="10">10</option>
              <option value="15">15</option>
              <option value="20">20</option>
            </select>
            <button
              onClick={handleNextPage}
              className="focus:shadow-outline rounded-md border-2 border-oceanblue bg-white px-1 py-0.5 text-[14px] font-bold text-red-950 hover:bg-gray-100 focus:outline-none disabled:bg-gray-300"
              disabled={letters?.last || !letters}
            >
              <DoubleRight />
            </button>
          </div>
          <div className="ml-2 flex items-center justify-center rounded-lg  bg-darkblue-200 px-2 py-2">
            <span className=" text-white">
              <MagnifyingGlass />
            </span>
            <select
              value={apiCall}
              onChange={handleApiChange}
              className="ml-1 rounded-lg bg-yellow-200 px-2 text-darkblue-400"
            >
              <option value="number">Məktubun &#8470;-si</option>
              <option value="time">Tarix</option>
              <option value="from and to">Idarələrə görə</option>
              <option value="created by">Müəllif</option>
            </select>
          </div>
          {apiCall === 'number' && (
            <div className="ml-2 flex items-center justify-center rounded-lg  bg-darkblue-200 px-2 py-2">
              <span className="text-white">Məktublar:</span>
              <input
                type="number"
                value={letterNoSearch}
                placeholder="0"
                onChange={(e) => {
                  setLetterNoSearch(e.target.value.replace(/\D/g, ''))
                }}
                className="ml-2 rounded-lg  bg-yellow-200 pl-2 text-darkblue-400"
              />
              <button
                onClick={() => setLetterNoSearch('')}
                className="ml-4 rounded-lg border border-purple-950 bg-red-500 px-2 text-white"
              >
                <DeleteXIcon />
              </button>
            </div>
          )}
          {apiCall === 'time' && (
            <div className="ml-2 flex items-center justify-center rounded-lg  bg-darkblue-200 px-2 py-1.5">
              <span className="text-white">Tarix:</span>
              <input
                type="date"
                value={search}
                placeholder="search"
                onChange={handleSearchİnputChange}
                className="ml-2 rounded-lg bg-yellow-200 pl-2 text-darkblue-400"
              />
              <button onClick={() => setSearch('')} className="ml-4 rounded-lg bg-red-500 px-2 text-white">
                <DeleteXIcon />
              </button>
            </div>
          )}
          {apiCall === 'from and to' && (
            <div className="flex gap-2">
              <div className="ml-2 flex items-center justify-center rounded-md">
                <Select
                  options={departmentOptions}
                  onChange={(selectedOption) => {
                    setFromDepartment(selectedOption.value)
                    setSearch(selectedOption.value)
                  }}
                  value={fromDepartment ? { value: fromDepartment, label: fromDepartment } : null}
                  placeholder="Haradan"
                  styles={customSelectStyles}
                  noOptionsMessage={() => 'Yanlış seçim'}
                />
                <button
                  onClick={() => {
                    setFromDepartment('')
                  }}
                  className="text-md ml-2 rounded-[20px]  bg-red-500 px-1 py-1 text-white"
                >
                  <DeleteXIcon />
                </button>
              </div>
              <div className="flex items-center justify-center rounded-md">
                <Select
                  options={departmentOptions}
                  onChange={(selectedOption) => {
                    setToDepartment(selectedOption.value)
                    setSearch(selectedOption.value)
                  }}
                  value={toDepartment ? { value: toDepartment, label: toDepartment } : null}
                  placeholder="Hara"
                  styles={customSelectStyles}
                  noOptionsMessage={() => 'Yanlış seçim'}
                />
                <button
                  onClick={() => {
                    setToDepartment('')
                  }}
                  className="text-md ml-2 rounded-[20px] bg-red-500 px-1 py-1 text-white"
                >
                  <DeleteXIcon />
                </button>
              </div>
            </div>
          )}
          {apiCall === 'created by' && (
            <div className="ml-2 flex items-center justify-center rounded-md">
              <Select
                options={userOptions}
                onChange={(selectedOption) => {
                  if (selectedOption) {
                    setUser(selectedOption.label)
                    setSearch(`${selectedOption.label}`)
                  } else {
                    setUser(null)
                    setSearch('')
                  }
                }}
                value={user ? { value: user, label: user } : null}
                placeholder="Müəllif"
                styles={customSelectStyles}
                noOptionsMessage={() => 'Yanlış seçim'}
                className={'w-60'}
              />
              <button
                onClick={() => {
                  setUser(null)
                  setSearch('')
                }}
                className="text-md ml-2 rounded-[20px] bg-red-500 px-1 py-1 text-white"
              >
                <DeleteXIcon />
              </button>
            </div>
          )}
          <div className="ml-2 flex items-center justify-center rounded-lg bg-darkblue-200 px-2 py-2">
            <span className="text-white">
              <AdjustmentsHorizontal />
            </span>
            <select
              value={sortBy}
              onChange={handleSortChange}
              className="ml-1 rounded-lg  bg-yellow-200 px-2 text-darkblue-400"
            >
              <option value="letterNo">Məktubun &#8470;-si</option>
              <option value="date">Tarix</option>
            </select>
          </div>
        </div>
        <div className="mb-2 min-h-[84%]">
          <table className="w-full border-collapse bg-white font-sans">
            <thead>
              <tr className="bg-yellow-200">
                <th className="w-[10%] border border-l-0 border-gray-400 px-2 py-1">Məktubun &#8470;</th>
                <th className="border border-gray-400 px-2 py-1">Haradan</th>
                <th className="border border-gray-400 px-2 py-1">Hara</th>
                <th className="border border-gray-400 px-2 py-1">Mühümlük</th>
                <th className="border border-gray-400 px-1 py-0">Müəllif</th>
                <th className="border border-gray-400 px-2 py-1">Tarix</th>
                <th className="border border-gray-400 px-2 py-1">Qeyd</th>
                <th className="border border-r-0 border-gray-400 px-2 py-1">Əməliyyatlar</th>
              </tr>
            </thead>
            <tbody>
              {!letterNoSearch &&
                letters?.content?.length > 0 &&
                letters?.content?.map((letter, index) => (
                  <tr key={nanoid()}>
                    <td className="w-[5%] border border-l-0 border-gray-400 px-1 py-0">{letter?.letterNo}</td>
                    <td className="w-[10%] border border-gray-400 px-1 py-0">
                      {letter?.fromDepartment?.name}
                    </td>
                    <td className="w-[10%] border border-gray-400 px-1 py-0">{letter?.toDepartment?.name}</td>
                    <td className="w-[8%] border border-gray-400 px-1 py-0">
                      {letter?.importanceDegree?.name}
                    </td>
                    <td className="group relative w-[14%] cursor-default border border-gray-400 px-1 py-0">
                      <span>
                        {letter?.createdBy?.firstName} {letter?.createdBy?.lastName}
                      </span>
                      <span className="tooltip left-2 z-10 group-hover:scale-100">
                        <strong>
                          {letter?.createdBy?.lastName +
                            ' ' +
                            letter?.createdBy?.firstName +
                            ' ' +
                            letter?.createdBy?.fatherName}
                        </strong>
                        <p>Xidməti vəsiqə: AZ-{letter?.createdBy?.policeCard}</p>
                        <p>Rütbə: {letter?.createdBy?.rank}</p>
                        <p>İş yeri: {letter?.createdBy?.department.name}</p>
                      </span>
                    </td>
                    <td className="w-[8%] border border-gray-400 px-1 py-0">{letter?.date}</td>
                    <td className="group relative min-w-[15%] max-w-[200px] border border-gray-400 px-1 py-0">
                      <div className="h-5 overflow-hidden">
                        {(letter?.note).slice(0, 42)}
                        {letter?.note?.length > 40 ? '...' : ''}
                      </div>
                      {letter?.note?.length > 40 && (
                        <span className="tooltip z-10 group-hover:scale-100">
                          <strong className="text-wrap block max-w-[320px]">{letter?.note}</strong>
                        </span>
                      )}
                    </td>
                    <td className="w-[10%] border border-r-0 border-gray-400 py-0">
                      <div className="flex justify-center gap-2.5">
                        <button
                          className="mb-1 mt-1 rounded bg-green-900 px-3 py-1 text-white transition duration-300 hover:bg-green-600"
                          onClick={() => handleUpdate(letter?.id)}
                        >
                          <UpdateIcon />
                        </button>
                        <UpdateLetter
                          letterId={letterToUpdateId}
                          updateOpen={updateOpen}
                          onUpdateClose={() => setUpdateOpen(false)}
                        />
                        <button
                          className="mb-1 mt-1 rounded bg-red-900 px-3 py-1 text-white transition duration-300 hover:bg-red-600"
                          onClick={() => handleDelete(letter?.id, letter?.letterNo)}
                        >
                          <TrashIcon />
                        </button>
                        <DeleteLetter
                          letterId={letterToDeleteId}
                          deleteOpen={deleteOpen}
                          onDeleteClose={() => setDeleteOpen(false)}
                          letterNumber={letterNumberToDelete}
                        />
                      </div>
                    </td>
                  </tr>
                ))}
              {!nomLoading && !isLoading && !letterNoSearch && !letters?.content?.length > 0 && (
                <tr>
                  <td>Tapılmadı</td>
                </tr>
              )}
              {nomLoading && (
                <tr>
                  <td>Məktub axtarılır</td>
                </tr>
              )}
              {letterNoSearch && letterByNo?.letterNo && (
                <tr>
                  <td className="w-[5%] border border-l-0 border-gray-400 px-1 py-0">
                    {letterByNo.letterNo}
                  </td>
                  <td className="w-[10%] border border-gray-400 px-1 py-0">
                    {letterByNo.fromDepartment.name}
                  </td>
                  <td className="w-[10%] border border-gray-400 px-1 py-0">{letterByNo.toDepartment.name}</td>
                  <td className="w-[8%] border border-gray-400 px-1 py-0">
                    {letterByNo.importanceDegree.name}
                  </td>
                  <td className="group relative w-[14%] cursor-default border border-gray-400 px-1 py-0">
                    <span>
                      {letterByNo?.createdBy?.firstName} {letterByNo?.createdBy?.lastName}
                    </span>
                    <span className="tooltip z-10 group-hover:scale-100">
                      <strong>
                        {letterByNo?.createdBy?.lastName +
                          ' ' +
                          letterByNo?.createdBy?.firstName +
                          ' ' +
                          letterByNo?.createdBy?.fatherName}
                      </strong>
                      <p>Xidməti vəsiqə: AZ-{letterByNo?.createdBy?.policeCard}</p>
                      <p>Rütbə: {letterByNo?.createdBy?.rank}</p>
                      <p>İş yeri: {letterByNo?.createdBy?.department.name}</p>
                    </span>
                  </td>
                  <td className="w-[8%] border border-gray-400 px-1 py-0">{letterByNo.date}</td>
                  <td className="group relative min-w-[15%] max-w-[200px] border border-gray-400 px-1 py-0">
                    <div className="h-5 overflow-hidden">
                      {(letterByNo?.note).slice(0, 42)}
                      {letterByNo?.note?.length > 40 ? '...' : ''}
                    </div>
                    {letterByNo?.note?.length > 40 && (
                      <span className="tooltip z-10 group-hover:scale-100">
                        <strong className="text-wrap block max-w-[320px]">{letterByNo?.note}</strong>
                      </span>
                    )}
                  </td>
                  <td className="w-[10%] border border-r-0 border-gray-400 px-1 py-0">
                    <div className="flex gap-2.5">
                      <button
                        className="mb-1 ml-1 mt-1 rounded bg-green-900 px-3 py-1 text-white transition duration-300 hover:bg-green-600"
                        onClick={() => handleUpdate(letterByNo?.id)}
                      >
                        <UpdateIcon />
                      </button>
                      <UpdateLetter
                        letterId={letterToUpdateId}
                        updateOpen={updateOpen}
                        onUpdateClose={() => setUpdateOpen(false)}
                      />
                      <button
                        className="mb-1 mr-1.5 mt-1 rounded bg-red-900 px-3 py-1 text-white transition duration-300 hover:bg-red-600"
                        onClick={() => handleDelete(letterByNo?.id, letterByNo?.letterNo)}
                      >
                        <TrashIcon />
                      </button>
                      <DeleteLetter
                        letterId={letterToDeleteId}
                        deleteOpen={deleteOpen}
                        onDeleteClose={() => setDeleteOpen(false)}
                        letterNumber={letterNumberToDelete}
                      />
                    </div>
                  </td>
                </tr>
              )}
              {!isLoading && !nomLoading && letterNoSearch && !letterByNo?.letterNo && (
                <tr>
                  <td>Tapılmadı</td>
                </tr>
              )}
              {isLoading && (
                <tr>
                  <td>Cədvəl yüklənir</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
      <div className="p-1"></div>
    </div>
  )
}

export default AllLetters
