import { Router } from 'express'
import Thought from '../models/Thought.js'
import auth from '../middleware/auth.js'

const router = Router()

// 1) List with pagination, filtering, sorting
router.get('/', async (req, res) => {
  try {
    const page = Math.max(1, parseInt(req.query.page, 10) || 1)
    const limit = Math.max(1, parseInt(req.query.limit, 10) || 20)
    const { hearts, minHearts, sortBy, order } = req.query

    let filter = {}
    if (hearts != null) filter.hearts = Number(hearts)
    else if (minHearts != null) filter.hearts = { $gte: Number(minHearts) }

    const field = sortBy === 'hearts' ? 'hearts' : 'createdAt'
    const direction = order === 'asc' ? 1 : -1

    const totalCount = await Thought.countDocuments(filter)
    if (totalCount === 0) {
      return res.status(404).json({
        success: false,
        response: [],
        message: 'No thoughts found matching your criteria.'
      })
    }
    const totalPages = Math.ceil(totalCount / limit)

    const thoughts = await Thought.find(filter)
      .sort({ [field]: direction })
      .skip((page - 1) * limit)
      .limit(limit)

    res.status(200).json({
      success: true,
      response: thoughts,
      message: 'Thoughts fetched successfully.',
      meta: { page, limit, totalCount, totalPages }
    })
  } catch (error) {
    res.status(500).json({
      success: false,
      response: error,
      message: 'Failed to fetch thoughts.'
    })
  }
})

// 2) Sort-only endpoint
router.get('/sort', async (req, res) => {
  try {
    const { sortBy = 'createdAt', order = 'desc' } = req.query
    const field = sortBy === 'hearts' ? 'hearts' : 'createdAt'
    const direction = order === 'asc' ? 1 : -1
    const thoughts = await Thought.find().sort({ [field]: direction })

    if (thoughts.length === 0) {
      return res.status(404).json({
        success: false,
        response: [],
        message: 'No thoughts to sort.'
      })
    }
    res.status(200).json({
      success: true,
      response: thoughts,
      message: 'Thoughts sorted successfully.'
    })
  } catch (error) {
    res.status(500).json({
      success: false,
      response: error,
      message: 'Failed to sort thoughts.'
    })
  }
})

// 3) Get one
router.get('/:id', async (req, res) => {
  try {
    const thought = await Thought.findById(req.params.id)
    if (!thought) {
      return res.status(404).json({
        success: false,
        response: null,
        message: `Thought with ID '${req.params.id}' not found.`
      })
    }
    res.status(200).json({
      success: true,
      response: thought,
      message: 'Thought fetched successfully.'
    })
  } catch (error) {
    res.status(500).json({
      success: false,
      response: error,
      message: 'Failed to fetch thought.'
    })
  }
})

// 4) Create
router.post('/', auth, async (req, res) => {
  try {
    const t = new Thought({ message: req.body.message, owner: req.userId })
    const saved = await t.save()
    res.status(201).json({
      success: true,
      response: saved,
      message: 'Thought created successfully.'
    })
  } catch (error) {
    res.status(500).json({
      success: false,
      response: error,
      message: 'Failed to create thought.'
    })
  }
})

// 5) Update (full replace)
router.put('/:id', auth, async (req, res) => {
  try {
    const thought = await Thought.findById(req.params.id)
    if (!thought) {
      return res.status(404).json({
        success: false,
        response: null,
        message: `Thought with ID '${req.params.id}' not found.`
      })
    }
    if (thought.owner.toString() !== req.userId) {
      return res.status(403).json({
        success: false,
        response: null,
        message: 'Forbidden: You do not own this thought.'
      })
    }
    const updated = await Thought.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    )
    res.status(200).json({
      success: true,
      response: updated,
      message: 'Thought updated successfully.'
    })
  } catch (error) {
    res.status(500).json({
      success: false,
      response: error,
      message: 'Failed to update thought.'
    })
  }
})

// 6) Partial update (message only)
router.patch('/:id', auth, async (req, res) => {
  try {
    const thought = await Thought.findById(req.params.id)
    if (!thought) {
      return res.status(404).json({
        success: false,
        response: null,
        message: `Thought with ID '${req.params.id}' not found.`
      })
    }
    if (thought.owner.toString() !== req.userId) {
      return res.status(403).json({
        success: false,
        response: null,
        message: 'Forbidden: You do not own this thought.'
      })
    }
    const edited = await Thought.findByIdAndUpdate(
      req.params.id,
      { message: req.body.message },
      { new: true, runValidators: true }
    )
    res.status(200).json({
      success: true,
      response: edited,
      message: 'Thought edited successfully.'
    })
  } catch (error) {
    res.status(500).json({
      success: false,
      response: error,
      message: 'Failed to edit thought.'
    })
  }
})

// 7) Delete
router.delete('/:id', auth, async (req, res) => {
  try {
    const thought = await Thought.findById(req.params.id)
    if (!thought) {
      return res.status(404).json({
        success: false,
        response: null,
        message: `Thought with ID '${req.params.id}' not found.`
      })
    }
    if (thought.owner.toString() !== req.userId) {
      return res.status(403).json({
        success: false,
        response: null,
        message: 'Forbidden: You do not own this thought.'
      })
    }
    await thought.delete()
    res.status(200).json({
      success: true,
      response: { deletedId: req.params.id },
      message: 'Thought deleted successfully.'
    })
  } catch (error) {
    res.status(500).json({
      success: false,
      response: error,
      message: 'Failed to delete thought.'
    })
  }
})

// 8) Like — atomically increment hearts
router.post('/:id/like', auth, async (req, res) => {
  try {
    const updated = await Thought.findByIdAndUpdate(
      req.params.id,
      { $inc: { hearts: 1 } },
      { new: true }
    );
    if (!updated) {
      return res.status(404).json({
        success: false,
        response: null,
        message: `Thought with ID '${req.params.id}' not found.`
      });
    }
    res.status(200).json({
      success: true,
      response: updated,
      message: 'Thought liked successfully.'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      response: error,
      message: 'Failed to like thought.'
    });
  }
});

export default router