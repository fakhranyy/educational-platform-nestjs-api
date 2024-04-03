import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Request,
  UseGuards,
  UseInterceptors,
  UploadedFile,
} from '@nestjs/common';
import { CourseService } from './course.service';
import { CreateCourseDto } from './dto/create-course.dto';
import { UpdateCourseDto } from './dto/update-course.dto';
import { AuthGuard } from 'src/auth/guards/auth.guard';
import { FileInterceptor } from '@nestjs/platform-express';

@Controller('v1/courses')
export class CourseController {
  constructor(
    private readonly courseService: CourseService,
  ) {}

  @UseGuards(AuthGuard)
  @UseInterceptors(FileInterceptor('file'))
  @Post()
  create(
    @Request() req,
    @Body() createCourseDto: CreateCourseDto,
    @UploadedFile() file: Express.Multer.File,
  ) {
    return this.courseService.create(req, createCourseDto, file);
  }

  @Get()
  findAll() {
    return this.courseService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.courseService.findOne(+id);
  }

  @Get('/:slug/reviews')
  allCourseReviews(@Param('slug') slug: string) {
    return this.courseService.allCourseReviews(slug);
  }

  @UseGuards(AuthGuard)
  @Post('/:slug/enroll')
  enrollCourse(@Request() req, @Param('slug') slug: string) {
    return this.courseService.enrollCourse(req, slug);
  }

  @UseGuards(AuthGuard)
  @Delete('/:slug/unenroll')
  unEnrollCourse(@Request() req, @Param('slug') slug: string) {
    return this.courseService.unEnrollCourse(req, slug);
  }

  @UseGuards(AuthGuard)
  @Patch(':id')
  update(
    @Request() req,
    @Param('id') id: string,
    @Body() updateCourseDto: UpdateCourseDto,
  ) {
    return this.courseService.update(req, +id, updateCourseDto);
  }

  @UseGuards(AuthGuard)
  @Delete(':id')
  remove(@Request() req, @Param('id') id: string) {
    return this.courseService.remove(req, +id);
  }
}
