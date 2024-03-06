import { useMutation, useQueryClient } from '@tanstack/react-query'
import toast from 'react-hot-toast'
import { deleteLetter } from '../api/axiosApi'
import { DeleteXIcon, TrashIcon } from '../assets/HeroIcons'
import { useAuth } from '../context/AuthContext'

const DeleteLetter = ({ letterId, deleteOpen, onDeleteClose, letterNumber }) => {
  const { auth } = useAuth()
  const { jwtToken } = auth || null
  const queryClient = useQueryClient()

  const deleteLetterMutation = useMutation({
    mutationFn: ({ letterId }) => deleteLetter(letterId, jwtToken),
    onSuccess: () => {
      queryClient.invalidateQueries(['lettersData'])
      queryClient.invalidateQueries(['letters'])
      toast.success('Məktub silindi')
    },
    onError: (error) => {
      if (!error?.response) toast.error('Server cavab vermir')
      else if (error?.response?.status === 400) toast.error('Məlumatlar düzgün doldurulmayıb')
      else if (error?.response?.status === 401)
        toast.error('Bu əməliyyatı yerinə yetirməyə səlahiyyətiniz çatmır')
      else if (error?.response?.status === 409) toast.error('Bu nömrəli məktub bazada mövcuddur')
      else toast.error('Error, səhifəni yeniləyin')
    },
  })

  const handleSubmit = (e) => {
    e.preventDefault()
    deleteLetterMutation.mutate({ letterId })
    onDeleteClose()
  }

  return (
    <div
      onClick={onDeleteClose}
      className={`
    fixed inset-0 z-10 flex items-center justify-center transition-colors
    ${deleteOpen ? 'visible bg-black/20' : 'invisible'}
    `}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className={`rounded-xl border-2 border-oceanblue bg-darkblue-900 px-6 pb-4 pt-2 shadow ${
          deleteOpen ? 'scale-100 opacity-100' : 'scale-0 opacity-0'
        }`}
      >
        <div className="text-center text-xl font-bold text-white">Silmə əməliyyatı</div>
        <button
          onClick={onDeleteClose}
          className="absolute right-1 top-1 rounded-md px-2 py-1 text-white hover:bg-red-500"
        >
          <DeleteXIcon />
        </button>
        <div className="text-md mt-4 text-white">{letterNumber} nömrəli məktubu silmək istəyirsiz?</div>
        <form className="flex flex-col items-center gap-2" onSubmit={handleSubmit}>
          <button
            type="submit"
            disabled={deleteLetterMutation.isPending}
            className="btn-red custom-box-shadow mt-3 rounded-md border-oceanblue px-5 py-1 hover:bg-red-600"
          >
            <TrashIcon />
          </button>
        </form>
      </div>
    </div>
  )
}

export default DeleteLetter
