import { GrFormPrevious } from 'react-icons/gr';
import { Link, useNavigate } from 'react-router-dom';
interface BreadcrumbProps {
  pageName: string;
  showBackButton?: boolean;
}
const Breadcrumb = ({ pageName, showBackButton = true }: BreadcrumbProps) => {
  const navigate = useNavigate();

  return (
    <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
      <div className='flex items-center gap-2'>
        {showBackButton && (
          <button
          onClick={() => navigate(-1)}
          className='bg-ash-2 hover:bg-ash-3 flex items-center justify-center w-8 h-8 rounded-lg' // Set width and height for a square button
        >
          <GrFormPrevious size={20}/> 
        </button>
        )}
        <h2 className="text-title-md2 font-semibold text-black dark:text-white">
          {pageName}
        </h2>
      </div>

      <nav>
        <ol className="flex items-center gap-2">
          <li>
            <Link className="font-medium" to="/">
              Dashboard /
            </Link>
          </li>
          <li className="font-medium text-primary">{pageName}</li>
        </ol>
      </nav>
    </div>
  );
};

export default Breadcrumb;
