import { getRepository, Like } from 'typeorm';
import Category from '../models/Category';

interface Request {
  title: string;
}

class FindOrCreateCategoryService {
  public async execute({ title }: Request): Promise<Category> {
    const categoryRepository = getRepository(Category);
    let category = await categoryRepository.findOne({
      where: { title: Like(`${title}`) },
    });

    if (!category) {
      category = categoryRepository.create({ title });
      categoryRepository.save(category);
    }

    return category;
  }
}

export default FindOrCreateCategoryService;
